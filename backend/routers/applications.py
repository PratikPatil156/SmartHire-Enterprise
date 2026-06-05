from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import mysql.connector
from database import get_db, log_activity
from auth_utils import get_current_user

router = APIRouter(prefix="/api", tags=["Applications"])

class UpdateStatusSchema(BaseModel):
    status: str
    interview_date: Optional[str] = None
    interview_time: Optional[str] = None
    interview_meet_link: Optional[str] = None

# 1. APPLY JOB API
@router.post("/jobs/{job_id}/apply")
def apply_job(job_id: int, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can apply for jobs")
    conn, cursor = db
    try:
        query = "INSERT INTO applications (candidate_id, job_id, status) VALUES (%s, %s, 'Applied')"
        cursor.execute(query, (current_user["user_id"], job_id))
        conn.commit()
        
        # Log Activity
        cursor.execute("SELECT name FROM users WHERE id = %s", (current_user["user_id"],))
        user_row = cursor.fetchone()
        user_name = user_row["name"] if user_row else "Candidate"
        cursor.execute("SELECT title FROM jobs WHERE id = %s", (job_id,))
        job_row = cursor.fetchone()
        job_title = job_row["title"] if job_row else "Job"
        log_activity(db, user_name, "Applied", job_title, "Candidate", f"Candidate successfully applied for the {job_title} opening.", "hiring")
        
        return {"message": "Applied successfully"}
    except mysql.connector.Error as err:
        if err.errno == 1062:
            raise HTTPException(status_code=400, detail="You have already applied for this job")
        raise HTTPException(status_code=500, detail=str(err))

# 2. GET APPLICATIONS API (HR gets all, Candidate gets their own)
@router.get("/applications")
def get_applications(current_user=Depends(get_current_user), db=Depends(get_db)):
    conn, cursor = db
    from parser_utils import calculate_ats_score
    if current_user.get("role") == "hr":
        # HR receives all candidate applications submitted to their own posted jobs
        query = """
            SELECT 
                a.id, a.status, a.applied_at, a.job_id, a.candidate_id,
                a.interview_date, a.interview_time, a.interview_meet_link, a.interview_code,
                u.name AS candidate_name, u.email AS candidate_email,
                j.title AS job_title, j.company AS job_company, j.requirements AS job_requirements,
                r.extracted_text,
                GROUP_CONCAT(at.tag_name) AS assigned_tags
            FROM applications a
            JOIN users u ON a.candidate_id = u.id
            JOIN jobs j ON a.job_id = j.id
            LEFT JOIN resumes r ON a.candidate_id = r.candidate_id
            LEFT JOIN application_tags at ON a.id = at.application_id
            WHERE j.hr_id = %s
            GROUP BY a.id
            ORDER BY a.applied_at DESC
        """
        cursor.execute(query, (current_user["user_id"],))
        rows = cursor.fetchall()
        result = []
        for row in rows:
            text = row["extracted_text"] if row["extracted_text"] else ""
            reqs = [s.strip() for s in row["job_requirements"].split(',')] if row["job_requirements"] else []
            job_score = calculate_ats_score(text, reqs)
            tags_list = [t.strip() for t in row["assigned_tags"].split(',')] if row.get("assigned_tags") else []
            # Parse candidate skills dynamically from extracted_text
            from parser_utils import extract_skills
            matched_skills = extract_skills(text, cursor)
            
            # Prioritize skills that match the job requirements (case-insensitive)
            if reqs:
                reqs_lower = [r.lower() for r in reqs]
                matched_skills.sort(key=lambda s: (0 if s.lower() in reqs_lower else 1, -len(s)))

            result.append({
                "id": row["id"],
                "status": row["status"],
                "applied_at": row["applied_at"],
                "job_id": row["job_id"],
                "candidate_id": row["candidate_id"],
                "candidate_name": row["candidate_name"],
                "candidate_email": row["candidate_email"],
                "job_title": row["job_title"],
                "job_company": row["job_company"],
                "ai_score": job_score,
                "tags": tags_list,
                "skills": matched_skills,
                "interview_date": row["interview_date"],
                "interview_time": row["interview_time"],
                "interview_meet_link": row["interview_meet_link"],
                "interview_code": row["interview_code"]
            })
        return result
    else:
        # Candidates receive their own applications
        query = """
            SELECT 
                a.id, a.status, a.applied_at, a.job_id, a.interview_date, a.interview_time, a.interview_meet_link, a.interview_code,
                j.title AS job_title, j.company AS job_company, j.requirements AS job_requirements,
                r.extracted_text
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            LEFT JOIN resumes r ON a.candidate_id = r.candidate_id
            WHERE a.candidate_id = %s
            ORDER BY a.applied_at DESC
        """
        cursor.execute(query, (current_user["user_id"],))
        rows = cursor.fetchall()
        result = []
        for row in rows:
            text = row["extracted_text"] if row["extracted_text"] else ""
            reqs = [s.strip() for s in row["job_requirements"].split(',')] if row["job_requirements"] else []
            job_score = calculate_ats_score(text, reqs)
            result.append({
                "id": row["id"],
                "status": row["status"],
                "applied_at": row["applied_at"],
                "job_id": row["job_id"],
                "job_title": row["job_title"],
                "job_company": row["job_company"],
                "ai_score": job_score,
                "interview_date": row["interview_date"],
                "interview_time": row["interview_time"],
                "interview_meet_link": row["interview_meet_link"],
                "interview_code": row["interview_code"]
            })
        return result

# 3. UPDATE APPLICATION STATUS API
@router.put("/applications/{id}/status")
def update_application_status(id: int, payload: UpdateStatusSchema, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can update application status")
    
    passcode = None
    conn, cursor = db
    
    # Fetch candidate name, email, job title, and owner before updating status for logging and security validation
    cursor.execute("""
        SELECT u.name AS candidate_name, u.email AS candidate_email, j.title AS job_title, j.hr_id 
        FROM applications a
        JOIN users u ON a.candidate_id = u.id
        JOIN jobs j ON a.job_id = j.id
        WHERE a.id = %s
    """, (id,))
    app_row = cursor.fetchone()
    
    if not app_row:
        raise HTTPException(status_code=404, detail="Application not found")
    if app_row["hr_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="You do not have permission to update the status of this application")
    
    if payload.status == "Shortlisted":
        import random
        passcode = str(random.randint(100000, 999999))
        
        cursor.execute("""
            UPDATE applications 
            SET status = %s, interview_date = %s, interview_time = %s, interview_meet_link = %s, interview_code = %s 
            WHERE id = %s
        """, (payload.status, payload.interview_date, payload.interview_time, payload.interview_meet_link, passcode, id))
        
        # Trigger Automated Email Notification
        try:
            from email_utils import send_interview_email
            send_interview_email(
                app_id=id,
                candidate_name=app_row["candidate_name"],
                candidate_email=app_row["candidate_email"],
                job_title=app_row["job_title"],
                interview_date=payload.interview_date,
                interview_time=payload.interview_time,
                meet_link=payload.interview_meet_link,
                interview_code=passcode
            )
        except Exception as e:
            print(f"Failed to dispatch email: {e}")
    else:
        cursor.execute("UPDATE applications SET status = %s WHERE id = %s", (payload.status, id))
    conn.commit()
    
    # Log Activity
    if app_row:
        cursor.execute("SELECT name FROM users WHERE id = %s", (current_user["user_id"],))
        hr_row = cursor.fetchone()
        hr_name = hr_row["name"] if hr_row else "HR"
        
        # Determine log category/type based on status
        log_type = "success" if payload.status == "Hired" else ("status" if payload.status == "Rejected" else "hiring")
        log_activity(db, hr_name, payload.status, app_row["candidate_name"], "HR / Recruiter", f"HR changed application status to '{payload.status}' for candidate {app_row['candidate_name']} ({app_row['job_title']}).", log_type)
        
    return {
        "message": "Status updated successfully",
        "interview_code": passcode
    }
