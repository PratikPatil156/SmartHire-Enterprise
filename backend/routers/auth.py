import io
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel, EmailStr
from pypdf import PdfReader
from database import get_db, log_activity
from auth_utils import create_access_token
from parser_utils import calculate_ats_score

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

# REGISTER API
@router.post("/register")
def register(user: RegisterSchema, db=Depends(get_db)):
    conn, cursor = db
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered!")
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    query = "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (user.name, user.email, hashed_password, user.role))
    conn.commit()
    log_activity(db, user.name, "Registered", user.name, user.role.capitalize(), f"{user.role.capitalize()} account created successfully.", "auth")
    return {"message": "Registration Successful!"}

# LOGIN API
@router.post("/login")
def login(credentials: LoginSchema, db=Depends(get_db)):
    conn, cursor = db
    
    # User ko email se dhoondo
    cursor.execute("SELECT * FROM users WHERE email = %s", (credentials.email,))
    user = cursor.fetchone()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid Email or Password!")
    
    # Password check karo
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), user['password'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid Email or Password!")
    
    # JWT Token banao jisme user id aur role chhupa hoga
    token = create_access_token({"user_id": user['id'], "role": user['role']})
    log_activity(db, user['name'], "Logged In", user['name'], user['role'].capitalize(), f"{user['role'].capitalize()} logged in successfully.", "auth")
    
    return {
        "message": "Login Successful!",
        "token": token,
        "user": {
            "id": user['id'],
            "name": user['name'],
            "email": user['email'],
            "role": user['role']
        }
    }

# RESUME UPLOAD + AI MATCHING + DATABASE STORAGE
@router.post("/upload-resume/{user_id}")
async def upload_resume(user_id: int, file: UploadFile = File(...), db=Depends(get_db)):
    conn, cursor = db
    
    # 1. User Validation
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found!")
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported!")
    
    try:
        # 2. Extract Text
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        reader = PdfReader(pdf_file)
        resume_text = "".join([page.extract_text() + "\n" for page in reader.pages if page.extract_text()])
        resume_text_lower = resume_text.lower()
        
        # 3. AI Matching Logic
        cursor.execute("SELECT * FROM jobs")
        all_jobs = cursor.fetchall()
        
        matched_jobs_list = []
        total_score = 0
        
        for job in all_jobs:
            req_skills = [s.strip() for s in job['requirements'].split(',')] if job['requirements'] else []
            match_percentage = calculate_ats_score(resume_text, req_skills)
            
            total_score += match_percentage
            matched_jobs_list.append({
                "id": job["id"],
                "title": job['title'],
                "company": job['company'],
                "requirements": job["requirements"],
                "location": job["location"],
                "description": job["description"],
                "match": f"{match_percentage}%"
            })
            
        matched_jobs_list.sort(key=lambda x: int(x["match"].replace("%","")), reverse=True)
        overall_score = int(total_score / len(all_jobs)) if all_jobs else 0
        
        # 4. SAVE TO DATABASE (resumes table)
        cursor.execute("SELECT id FROM resumes WHERE candidate_id = %s", (user_id,))
        if cursor.fetchone():
            cursor.execute("UPDATE resumes SET file_name=%s, extracted_text=%s, overall_score=%s WHERE candidate_id=%s", 
                           (file.filename, resume_text, overall_score, user_id))
        else:
            cursor.execute("INSERT INTO resumes (candidate_id, file_name, extracted_text, overall_score) VALUES (%s, %s, %s, %s)", 
                           (user_id, file.filename, resume_text, overall_score))
        
        # --- NEW: Auto-sync extracted skills, phone, and location to user_profiles table ---
        parsed_phone = "Not Specified"
        parsed_location = "Not Specified"
        parsed_skills = []
        
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
                
        skills_str = ", ".join(parsed_skills) if parsed_skills else ""
        
        # Check if profile exists, if yes update it
        cursor.execute("SELECT user_id FROM user_profiles WHERE user_id = %s", (user_id,))
        if cursor.fetchone():
            cursor.execute("""
                UPDATE user_profiles 
                SET phone = %s, location = %s, skills = %s, placement_ready = %s, 
                    profile_status = %s, profile_completed = %s, backend_progress = %s, 
                    frontend_progress = %s, interview_progress = %s, placement_insights_title = %s, 
                    placement_insights_desc = %s 
                WHERE user_id = %s
            """, (
                parsed_phone, parsed_location, skills_str, "95%", "Active", "18/20", 75, 90, 30, 
                "Placement Ready!", "Your profile is in the top 5% for Full Stack roles this week. Complete 2 more mock interviews to boost visibility.",
                user_id
            ))
        else:
            # Insert a profile with these skills
            cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = 'candidate' AND id <= %s", (user_id,))
            cand_count_res = cursor.fetchone()
            cand_count = cand_count_res['count'] if isinstance(cand_count_res, dict) else cand_count_res[0]
            student_id = f"STU-2026-{str(cand_count).zfill(4)}"

            cursor.execute("""
                INSERT INTO user_profiles 
                (user_id, phone, location, course_role, student_emp_id, skills, 
                 placement_ready, profile_status, profile_completed, backend_progress, 
                 frontend_progress, interview_progress, placement_insights_title, placement_insights_desc) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                user_id, parsed_phone, parsed_location, "SmartHire Candidate",
                student_id, skills_str, "95%", "Active", "18/20",
                75, 90, 30, "Placement Ready!",
                "Your profile is in the top 5% for Full Stack roles this week. Complete 2 more mock interviews to boost visibility."
            ))

        conn.commit()
        log_activity(db, user['name'], "Uploaded Resume", file.filename, "Candidate", f"Uploaded resume analyzed successfully with ATS compatibility match of {overall_score}%.", "ai")
        
        return {
            "status": "Success",
            "message": "Resume analyzed and saved successfully!",
            "overall_ai_index": overall_score,
            "recommended_jobs": matched_jobs_list
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Database saving failed.")
