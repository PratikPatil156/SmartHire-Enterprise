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

import os
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

@router.get("/download/{candidate_id}")
def download_resume(candidate_id: int, current_user=Depends(get_current_user), db=Depends(get_db)):
    # Candidate can download their own, HR can download any candidate's resume
    if current_user.get("role") != "hr" and current_user.get("user_id") != candidate_id:
        raise HTTPException(status_code=403, detail="You do not have permission to download this resume")

    conn, cursor = db
    cursor.execute("""
        SELECT r.*, u.name, u.email, up.phone, up.location
        FROM resumes r
        JOIN users u ON r.candidate_id = u.id
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE r.candidate_id = %s
    """, (candidate_id,))
    resume = cursor.fetchone()

    if not resume:
        raise HTTPException(status_code=404, detail="No resume found for this candidate")

    file_name = resume.get("file_name") or f"Candidate_{candidate_id}_Resume.pdf"
    if not file_name.lower().endswith(".pdf"):
        file_name += ".pdf"

    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "resumes")
    os.makedirs(upload_dir, exist_ok=True)

    # 1. Check if physical file exists via stored file_path
    file_path = resume.get("file_path")
    if file_path and os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/pdf", filename=file_name)

    # 2. Check standard saved location on disk
    standard_file_path = os.path.join(upload_dir, f"{candidate_id}_{resume['file_name']}")
    if os.path.exists(standard_file_path):
        return FileResponse(standard_file_path, media_type="application/pdf", filename=file_name)

    # 3. If file not on disk (e.g. prior uploads), generate a clean, professional PDF from extracted_text
    extracted_text = resume.get("extracted_text") or "No resume content available."
    generated_pdf_path = os.path.join(upload_dir, f"{candidate_id}_{file_name}")

    try:
        doc = SimpleDocTemplate(generated_pdf_path, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
        styles = getSampleStyleSheet()

        name_style = ParagraphStyle('NameStyle', parent=styles['Heading1'], fontSize=18, leading=22, textColor=colors.HexColor('#0f172a'))
        contact_style = ParagraphStyle('ContactStyle', parent=styles['Normal'], fontSize=10, leading=14, textColor=colors.HexColor('#475569'))
        body_style = ParagraphStyle('BodyStyle', parent=styles['Normal'], fontSize=9, leading=13, textColor=colors.HexColor('#334155'))

        story = [
            Paragraph(resume.get('name') or 'Candidate Resume', name_style),
            Paragraph(f"Email: {resume.get('email', 'N/A')} | Phone: {resume.get('phone', 'N/A')} | Location: {resume.get('location', 'N/A')}", contact_style),
            Spacer(1, 8),
            HRFlowable(width="100%", thickness=1, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=10)
        ]

        for line in extracted_text.split('\n'):
            l = line.strip()
            if l:
                safe_l = l.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                story.append(Paragraph(safe_l, body_style))
                story.append(Spacer(1, 2))

        doc.build(story)

        # Update file_path in database
        try:
            cursor.execute("UPDATE resumes SET file_path = %s WHERE candidate_id = %s", (generated_pdf_path, candidate_id))
            conn.commit()
        except Exception:
            pass

        return FileResponse(generated_pdf_path, media_type="application/pdf", filename=file_name)
    except Exception as e:
        print(f"Error generating fallback resume PDF: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve or generate resume file")

