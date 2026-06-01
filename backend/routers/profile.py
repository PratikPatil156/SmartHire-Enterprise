from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_db, log_activity

router = APIRouter(prefix="/api/profile", tags=["Profiles"])

class ProfileSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_image: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    course_role: Optional[str] = None
    student_emp_id: Optional[str] = None
    about: Optional[str] = None
    skills: Optional[str] = None
    placement_ready: Optional[str] = None
    profile_status: Optional[str] = None
    profile_completed: Optional[str] = None
    backend_progress: Optional[int] = 0
    frontend_progress: Optional[int] = 0
    interview_progress: Optional[int] = 0
    placement_insights_title: Optional[str] = None
    placement_insights_desc: Optional[str] = None
    achievements: Optional[str] = None

@router.get("/{user_id}")
def get_user_profile(user_id: int, db=Depends(get_db)):
    conn, cursor = db
    
    # 1. Check if user exists
    cursor.execute("SELECT id, name, email, role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Check if resume exists
    cursor.execute("SELECT extracted_text FROM resumes WHERE candidate_id = %s", (user_id,))
    resume_res = cursor.fetchone()
    resume_text = resume_res["extracted_text"] if resume_res else None
    
    # Parse resume details dynamically if present
    parsed_phone = "Not Specified"
    parsed_location = "Not Specified"
    parsed_skills = []
    
    if resume_text:
        import re
        # Parse Phone Number
        phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", resume_text)
        if phone_match:
            parsed_phone = phone_match.group(0).strip()
            
        # Parse Location
        loc_patterns = [
            r"(?:Location|Address|Residing in|Lives in)[:\s]+([^\n|]+)",
            r"\b(?:Bangalore|Bengaluru|Mumbai|Delhi|Pune|Hyderabad|Chennai|Kolkata|Maharashtra|Karnataka|Telangana|Tamil\s*Nadu|India)\b"
        ]
        for pattern in loc_patterns:
            match = re.search(pattern, resume_text, re.IGNORECASE)
            if match:
                if len(match.groups()) > 0 and match.group(1):
                    parsed_location = match.group(1).strip()
                else:
                    parsed_location = match.group(0).strip()
                break
                
        from parser_utils import extract_skills
        parsed_skills = extract_skills(resume_text, cursor)
                
    # 3. Check if profile exists
    cursor.execute("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
    profile = cursor.fetchone()
    
    if not profile:
        # Create default profile row based on role
        if user['role'] == 'candidate':
            skills_str = ", ".join(parsed_skills) if parsed_skills else ""
            cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'candidate' AND id <= %s", (user_id,))
            cand_count_res = cursor.fetchone()
            cand_count = cand_count_res['count'] if isinstance(cand_count_res, dict) else cand_count_res[0]
            student_id = f"STU-2026-{str(cand_count).zfill(4)}"

            default_query = """
                INSERT INTO user_profiles 
                (user_id, avatar_image, phone, location, course_role, student_emp_id, skills, 
                 placement_ready, profile_status, profile_completed, backend_progress, 
                 frontend_progress, interview_progress, placement_insights_title, placement_insights_desc) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(default_query, (
                user_id,
                None,
                parsed_phone,
                parsed_location,
                "SmartHire Candidate",
                student_id,
                skills_str,
                "10%" if not resume_text else "95%",
                "Pending" if not resume_text else "Active",
                "1/20" if not resume_text else "18/20",
                0 if not resume_text else 75,
                0 if not resume_text else 90,
                0 if not resume_text else 30,
                "Build Your Profile!" if not resume_text else "Placement Ready!",
                "Upload your resume to sync your skills and start getting matched to jobs." if not resume_text else "Your profile is in the top 5% for Full Stack roles this week. Complete 2 more mock interviews to boost visibility."
            ))
            conn.commit()
            
            # Fetch the newly created profile
            cursor.execute("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
            profile = cursor.fetchone()
        else:  # hr
            default_query = """
                INSERT INTO user_profiles 
                (user_id, avatar_image, phone, location, course_role, student_emp_id, about, skills, achievements) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(default_query, (
                user_id,
                None,
                "", # phone
                "", # location
                "HR Recruiter", # role/course_role
                "", # emp ID (company decides, keep empty)
                "HR Administrator in HireFlow AI.", # about
                "", # skills
                "" # achievements / highlights
            ))
            conn.commit()
            
            # Fetch the newly created profile
            cursor.execute("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
            profile = cursor.fetchone()
    else:
        # Sync/Update existing candidate profile with resume if we have one and profile fields are default
        if user['role'] == 'candidate' and resume_text:
            updated_fields = []
            params = []
            
            # If current profile has default placeholder values, update them with parsed ones
            if profile["phone"] == "+91 87671 82863" or not profile["phone"] or profile["phone"] == "Not Specified":
                updated_fields.append("phone = %s")
                params.append(parsed_phone)
            if profile["location"] == "Maharashtra, India" or not profile["location"] or profile["location"] == "Not Specified":
                updated_fields.append("location = %s")
                params.append(parsed_location)
            # Always sync skills if we have newly parsed ones
            if parsed_skills:
                skills_str = ", ".join(parsed_skills)
                # Overwrite if skills are default
                if profile["skills"] == "React.js, Python, Tailwind CSS, Data Structures, MySQL, FastAPI, REST API, Git" or not profile["skills"]:
                    updated_fields.append("skills = %s")
                    params.append(skills_str)
                    
            if updated_fields:
                params.append(user_id)
                cursor.execute(f"UPDATE user_profiles SET {', '.join(updated_fields)} WHERE user_id = %s", tuple(params))
                conn.commit()
                # Refetch
                cursor.execute("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
                profile = cursor.fetchone()
        
    # Combine user basic info (name, email, role) with profile info
    response_data = {
        "user_id": user_id,
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "avatar_image": profile["avatar_image"],
        "phone": profile["phone"],
        "location": profile["location"],
        "course_role": profile["course_role"],
        "student_emp_id": profile["student_emp_id"],
        "about": profile["about"],
        "skills": profile["skills"],
        "placement_ready": profile["placement_ready"],
        "profile_status": profile["profile_status"],
        "profile_completed": profile["profile_completed"],
        "backend_progress": profile["backend_progress"],
        "frontend_progress": profile["frontend_progress"],
        "interview_progress": profile["interview_progress"],
        "placement_insights_title": profile["placement_insights_title"],
        "placement_insights_desc": profile["placement_insights_desc"],
        "achievements": profile["achievements"]
    }
    
    return response_data

@router.put("/{user_id}")
def update_user_profile(user_id: int, profile: ProfileSchema, db=Depends(get_db)):
    conn, cursor = db
    
    # 1. Verify user exists
    cursor.execute("SELECT id, name, email, role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Update core user details (name and email) if provided
    if profile.name or profile.email:
        update_user_fields = []
        params = []
        if profile.name:
            update_user_fields.append("name = %s")
            params.append(profile.name)
        if profile.email:
            # Check unique email constraint
            cursor.execute("SELECT id FROM users WHERE email = %s AND id != %s", (profile.email, user_id))
            if cursor.fetchone():
                raise HTTPException(status_code=400, detail="Email is already in use by another user")
            update_user_fields.append("email = %s")
            params.append(profile.email)
            
        params.append(user_id)
        update_user_query = f"UPDATE users SET {', '.join(update_user_fields)} WHERE id = %s"
        cursor.execute(update_user_query, tuple(params))
        
    # 3. Check if profile row exists
    cursor.execute("SELECT user_id FROM user_profiles WHERE user_id = %s", (user_id,))
    if not cursor.fetchone():
        # Insert default row first
        cursor.execute("INSERT INTO user_profiles (user_id) VALUES (%s)", (user_id,))
        conn.commit()

    # 4. Update profile details
    update_profile_fields = []
    profile_params = []
    
    fields = [
        "avatar_image", "phone", "location", "course_role", "student_emp_id", "about", 
        "skills", "placement_ready", "profile_status", "profile_completed", 
        "backend_progress", "frontend_progress", "interview_progress", 
        "placement_insights_title", "placement_insights_desc", "achievements"
    ]
    
    for field in fields:
        val = getattr(profile, field)
        if val is not None:
            update_profile_fields.append(f"{field} = %s")
            profile_params.append(val)
            
    if update_profile_fields:
        profile_params.append(user_id)
        update_profile_query = f"UPDATE user_profiles SET {', '.join(update_profile_fields)} WHERE user_id = %s"
        cursor.execute(update_profile_query, tuple(profile_params))
        
    # Dynamically register any new skills in the catalog
    if profile.skills:
        from parser_utils import register_skills_in_catalog
        register_skills_in_catalog(db, profile.skills)
        
    conn.commit()
    
    # 5. Log activity
    log_activity(
        db, 
        profile.name or user["name"], 
        "Updated Profile", 
        profile.name or user["name"], 
        user["role"].capitalize(), 
        f"Profile details successfully persisted to MySQL backend.", 
        "profile"
    )
    
    return {"message": "Profile updated successfully!"}
