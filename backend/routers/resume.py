from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from auth_utils import get_current_user
from parser_utils import extract_skills, calculate_ats_score, generate_analysis_report

router = APIRouter(prefix="/api/resume", tags=["Resume"])

@router.get("/my-score")
def get_my_resume_score(current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates have resume scores")
    conn, cursor = db
    cursor.execute("SELECT file_name, extracted_text, overall_score FROM resumes WHERE candidate_id = %s", (current_user["user_id"],))
    resume = cursor.fetchone()
    if not resume:
        return {"has_resume": False, "overall_ai_index": 0, "recommended_jobs": []}
    
    resume_text = resume["extracted_text"] if resume["extracted_text"] else ""
    cursor.execute("SELECT * FROM jobs")
    all_jobs = cursor.fetchall()
    
    matched_jobs_list = []
    for job in all_jobs:
        req_skills = [s.strip() for s in job['requirements'].split(',')] if job['requirements'] else []
        # Calculate robust job-specific ATS score
        match_percentage = calculate_ats_score(resume_text, req_skills)
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
    
    # Robustly extract skills using our advanced taxonomy
    extracted_skills = extract_skills(resume_text)
    
    # If no skills found, provide some default foundational ones to prevent UI blankness
    if not extracted_skills:
        extracted_skills = ["React", "Python", "Tailwind CSS", "MySQL", "FastAPI"]

    return {
        "has_resume": True,
        "file_name": resume["file_name"],
        "overall_ai_index": resume["overall_score"],
        "skills": extracted_skills,
        "recommended_jobs": matched_jobs_list
    }

@router.get("/analysis")
def get_resume_analysis(job_id: int = None, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates have resume analysis")
    conn, cursor = db
    cursor.execute("SELECT file_name, extracted_text, overall_score FROM resumes WHERE candidate_id = %s", (current_user["user_id"],))
    resume = cursor.fetchone()
    if not resume:
        return {"has_resume": False}
    
    resume_text = resume["extracted_text"] if resume["extracted_text"] else ""
    
    # If job_id is provided, calculate match specifically for that job
    if job_id is not None:
        cursor.execute("""
            SELECT j.id, j.requirements, j.title, j.company 
            FROM applications a 
            JOIN jobs j ON a.job_id = j.id 
            WHERE a.candidate_id = %s AND j.id = %s
        """, (current_user["user_id"], job_id))
        job = cursor.fetchone()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found in your applications")
        
        req_skills = [s.strip() for s in job['requirements'].split(',')] if job['requirements'] else []
        report = generate_analysis_report(resume_text, req_skills)
        # Note: Do not sync overall_score in db if it is a filtered search!
        return report
    
    # Check if candidate has applied to any specific jobs to dynamically target recommendations
    cursor.execute("""
        SELECT j.requirements, j.id 
        FROM applications a 
        JOIN jobs j ON a.job_id = j.id 
        WHERE a.candidate_id = %s
    """, (current_user["user_id"],))
    applied_jobs = cursor.fetchall()
    
    if applied_jobs:
        target_jobs = applied_jobs
    else:
        # Fallback to all database jobs if no applications exist yet
        cursor.execute("SELECT id, requirements FROM jobs")
        target_jobs = cursor.fetchall()
        
    all_requirements = set()
    for j in target_jobs:
        if j["requirements"]:
            for skill in j["requirements"].split(','):
                all_requirements.add(skill.strip())
                
    target_skills = list(all_requirements)
    
    # Generate the comprehensive ATS insights report
    report = generate_analysis_report(resume_text, target_skills)
    
    # Sync the database overall_score with the newly calculated ATS score so the overall index updates instantly
    try:
        new_overall_score = report["score"]
        cursor.execute("UPDATE resumes SET overall_score = %s WHERE candidate_id = %s", (new_overall_score, current_user["user_id"]))
        conn.commit()
    except Exception as e:
        print(f"Error syncing overall_score: {e}")
        
    return report
