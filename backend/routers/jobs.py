from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import mysql.connector
from database import get_db, log_activity
from auth_utils import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

class JobCreateSchema(BaseModel):
    title: str
    company: str
    requirements: str
    description: str
    location: str

@router.get("")
def get_jobs(db=Depends(get_db)):
    conn, cursor = db
    cursor.execute("SELECT * FROM jobs ORDER BY posted_at DESC")
    return cursor.fetchall()

@router.post("")
def create_job(job: JobCreateSchema, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can post jobs")
    conn, cursor = db
    
    # Check if user is restricted to specific company (dynamic from token)
    user_company = current_user.get("company")
    if user_company and job.company.lower() != user_company.lower():
        raise HTTPException(status_code=400, detail=f"This user is restricted to post jobs only for {user_company}")

    query = "INSERT INTO jobs (hr_id, title, company, requirements, description, location) VALUES (%s, %s, %s, %s, %s, %s)"
    cursor.execute(query, (current_user["user_id"], job.title, job.company, job.requirements, job.description, job.location))
    conn.commit()
    
    # Dynamically register any new requirements as skills in the catalog
    if job.requirements:
        from parser_utils import register_skills_in_catalog
        register_skills_in_catalog(db, job.requirements)
    
    # Log Activity
    cursor.execute("SELECT name FROM users WHERE id = %s", (current_user["user_id"],))
    hr_row = cursor.fetchone()
    hr_name = hr_row["name"] if hr_row else "HR"
    log_activity(db, hr_name, "Posted Job", job.title, "HR / Recruiter", f"HR created a new job opening for the {job.title} position.", "hiring")
    
    return {"message": "Job posted successfully"}

@router.get("/my")
def get_my_jobs(current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can view their job postings")
    conn, cursor = db
    cursor.execute("SELECT * FROM jobs WHERE hr_id = %s ORDER BY posted_at DESC", (current_user["user_id"],))
    return cursor.fetchall()

@router.get("/saved")
def get_saved_jobs(current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can fetch saved jobs")
    conn, cursor = db
    query = """
        SELECT j.* 
        FROM saved_jobs sj
        JOIN jobs j ON sj.job_id = j.id
        WHERE sj.candidate_id = %s
        ORDER BY sj.saved_at DESC
    """
    cursor.execute(query, (current_user["user_id"],))
    return cursor.fetchall()

@router.delete("/{id}")
def delete_job(id: int, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can delete jobs")
    conn, cursor = db
    
    # Get job title and owner before deletion
    cursor.execute("SELECT title, hr_id FROM jobs WHERE id = %s", (id,))
    job_row = cursor.fetchone()
    if not job_row:
        raise HTTPException(status_code=404, detail="Job not found")
    if job_row["hr_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this job")
        
    job_title = job_row["title"]
    
    cursor.execute("DELETE FROM jobs WHERE id = %s", (id,))
    conn.commit()
    
    # Log Activity
    cursor.execute("SELECT name FROM users WHERE id = %s", (current_user["user_id"],))
    hr_row = cursor.fetchone()
    hr_name = hr_row["name"] if hr_row else "HR"
    log_activity(db, hr_name, "Deleted Job", job_title, "HR / Recruiter", f"HR deleted the job opening for {job_title}.", "hiring")
    
    return {"message": "Job deleted successfully"}

@router.put("/{id}")
def update_job(id: int, job: JobCreateSchema, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can edit jobs")
    conn, cursor = db
    
    # Check if user is restricted to specific company (dynamic from token)
    user_company = current_user.get("company")
    if user_company and job.company.lower() != user_company.lower():
        raise HTTPException(status_code=400, detail=f"This user is restricted to edit jobs only for {user_company}")

    # Check if job exists and belongs to the HR user
    cursor.execute("SELECT hr_id, title FROM jobs WHERE id = %s", (id,))
    job_row = cursor.fetchone()
    if not job_row:
        raise HTTPException(status_code=404, detail="Job not found")
    if job_row["hr_id"] != current_user["user_id"]:
        raise HTTPException(status_code=403, detail="You do not have permission to edit this job")
        
    query = """
        UPDATE jobs 
        SET title = %s, company = %s, requirements = %s, description = %s, location = %s 
        WHERE id = %s
    """
    cursor.execute(query, (job.title, job.company, job.requirements, job.description, job.location, id))
    conn.commit()
    
    # Dynamically register any new requirements as skills in the catalog
    if job.requirements:
        from parser_utils import register_skills_in_catalog
        register_skills_in_catalog(db, job.requirements)
        
    # Log Activity
    cursor.execute("SELECT name FROM users WHERE id = %s", (current_user["user_id"],))
    hr_row = cursor.fetchone()
    hr_name = hr_row["name"] if hr_row else "HR"
    log_activity(db, hr_name, "Updated Job", job.title, "HR / Recruiter", f"HR updated the job opening details for {job.title}.", "hiring")
    
    return {"message": "Job updated successfully"}

@router.post("/{job_id}/save")
def toggle_save_job(job_id: int, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can save jobs")
    conn, cursor = db
    cursor.execute("SELECT id FROM saved_jobs WHERE candidate_id = %s AND job_id = %s", (current_user["user_id"], job_id))
    saved = cursor.fetchone()
    if saved:
        cursor.execute("DELETE FROM saved_jobs WHERE id = %s", (saved["id"],))
        conn.commit()
        return {"message": "Job unsaved successfully", "saved": False}
    else:
        cursor.execute("INSERT INTO saved_jobs (candidate_id, job_id) VALUES (%s, %s)", (current_user["user_id"], job_id))
        conn.commit()
        return {"message": "Job saved successfully", "saved": True}
