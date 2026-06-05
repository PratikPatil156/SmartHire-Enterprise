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
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None
    portfolio_link: Optional[str] = None
    certifications: Optional[str] = None

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
                parsed_phone if parsed_phone != "Not Specified" else "",
                parsed_location if parsed_location != "Not Specified" else "",
                "SmartHire Candidate",
                student_id,
                skills_str,
                "10%",
                "Pending",
                "1/8",
                0,
                0,
                0,
                "Build Your Profile!",
                "Upload your resume to sync your skills and start getting matched to jobs."
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
                params.append(parsed_phone if parsed_phone != "Not Specified" else "")
            if profile["location"] == "Maharashtra, India" or not profile["location"] or profile["location"] == "Not Specified":
                updated_fields.append("location = %s")
                params.append(parsed_location if parsed_location != "Not Specified" else "")
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

    # Calculate Candidate dynamic fields
    if user['role'] == 'candidate':
        # Retrieve overall resume score
        cursor.execute("SELECT overall_score FROM resumes WHERE candidate_id = %s", (user_id,))
        resume_score_res = cursor.fetchone()
        has_resume = resume_score_res is not None
        resume_score = resume_score_res["overall_score"] if has_resume else 0
        
        # Calculate profile completeness
        total_fields = 8
        filled_fields = 0
        
        if user.get("name"): filled_fields += 1
        if user.get("email"): filled_fields += 1
        if has_resume: filled_fields += 1
        
        if profile.get("phone") and profile["phone"].strip() not in ["", "Not Specified", "Not assigned"]:
            filled_fields += 1
        if profile.get("location") and profile["location"].strip() not in ["", "Not Specified"]:
            filled_fields += 1
        if profile.get("course_role") and profile["course_role"].strip() not in ["", "SmartHire Candidate", "Candidate"]:
            filled_fields += 1
        if profile.get("about") and profile["about"].strip() not in ["", "Computer Science student passionate about software engineering and machine learning."]:
            filled_fields += 1
        if profile.get("skills") and profile["skills"].strip():
            filled_fields += 1
            
        profile_completed = f"{filled_fields}/{total_fields}"
        
        # ATS Readiness
        placement_ready = f"{resume_score}%" if has_resume else "10%"
        
        # Profile Status
        profile_status = "Active" if (has_resume and filled_fields >= 5) else "Pending"
        
        # Parse skills and calculate learning roadmap progress
        skills_list = []
        if profile.get("skills"):
            skills_list = [s.strip().lower() for s in profile["skills"].split(",") if s.strip()]
            
        backend_keywords = [
            "python", "java", "node.js", "node", "express", "django", "flask", "fastapi", "spring boot", "spring", 
            "go", "golang", "ruby", "rails", "nestjs", "asp.net", "php", "mysql", "postgresql", "mongodb", "redis", 
            "sql", "rest api", "api", "algorithms", "data structures", "git", "github", "docker", "kubernetes", "aws"
        ]
        
        frontend_keywords = [
            "react", "react.js", "vue", "angular", "svelte", "next.js", "html", "css", "javascript", "typescript", 
            "tailwind css", "tailwind", "bootstrap", "redux", "sass", "webpack", "figma"
        ]
        
        backend_count = sum(1 for sk in skills_list if any(kw in sk for kw in backend_keywords))
        frontend_count = sum(1 for sk in skills_list if any(kw in sk for kw in frontend_keywords))
        
        if not has_resume:
            backend_progress = 0
            frontend_progress = 0
            interview_progress = 0
        else:
            backend_progress = min(100, max(25, backend_count * 15))
            frontend_progress = min(100, max(25, frontend_count * 20))
            
            # Fetch application count for interview progress calculation
            cursor.execute("SELECT COUNT(*) as count FROM applications WHERE candidate_id = %s", (user_id,))
            app_count_res = cursor.fetchone()
            app_count = app_count_res['count'] if isinstance(app_count_res, dict) else app_count_res[0]
            
            interview_progress = min(100, max(30, 30 + app_count * 15))
            
        # Insights title and description
        if not has_resume:
            placement_insights_title = "Build Your Profile!"
            placement_insights_desc = "Upload your resume to sync your skills and start getting matched to jobs."
        else:
            if resume_score >= 80:
                placement_insights_title = "Placement Ready!"
                placement_insights_desc = f"Your resume score is outstanding ({resume_score}%). Your profile matches top tier listings. Keep applying to active openings!"
            elif resume_score >= 50:
                placement_insights_title = "Strong Match Profile"
                placement_insights_desc = f"Your resume score is {resume_score}%. Adding key skills like Docker or Next.js could boost your score for Full Stack roles."
            else:
                placement_insights_title = "Optimize Resume!"
                placement_insights_desc = f"Your resume match index is {resume_score}%. Try aligning your resume text with job descriptions to improve your match rate."
                
        about_val = profile["about"] if profile.get("about") else ""
    else:
        # HR does not use candidate dynamic metrics
        placement_ready = profile.get("placement_ready")
        profile_status = profile.get("profile_status")
        profile_completed = profile.get("profile_completed")
        backend_progress = profile.get("backend_progress", 0)
        frontend_progress = profile.get("frontend_progress", 0)
        interview_progress = profile.get("interview_progress", 0)
        placement_insights_title = profile.get("placement_insights_title")
        placement_insights_desc = profile.get("placement_insights_desc")
        about_val = profile.get("about", "")

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
        "about": about_val,
        "skills": profile["skills"],
        "placement_ready": placement_ready,
        "profile_status": profile_status,
        "profile_completed": profile_completed,
        "backend_progress": backend_progress,
        "frontend_progress": frontend_progress,
        "interview_progress": interview_progress,
        "placement_insights_title": placement_insights_title,
        "achievements": profile["achievements"],
        "github_link": profile.get("github_link"),
        "linkedin_link": profile.get("linkedin_link"),
        "portfolio_link": profile.get("portfolio_link"),
        "certifications": profile.get("certifications")
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
        "placement_insights_title", "placement_insights_desc", "achievements",
        "github_link", "linkedin_link", "portfolio_link", "certifications"
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
