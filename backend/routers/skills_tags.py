import re
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_db
from auth_utils import get_current_user

router = APIRouter(prefix="/api/skills-tags", tags=["Skills & Tags"])

class TagSchema(BaseModel):
    name: str

@router.get("/tags")
def get_tags(db=Depends(get_db)):
    conn, cursor = db
    cursor.execute("SELECT name FROM recruitment_tags ORDER BY id ASC")
    tags = cursor.fetchall()
    return [t["name"] for t in tags]

@router.post("/tags")
def create_tag(tag: TagSchema, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can manage tags.")
    conn, cursor = db
    try:
        cursor.execute("INSERT INTO recruitment_tags (name) VALUES (%s)", (tag.name.strip(),))
        conn.commit()
        return {"message": f"Tag '{tag.name}' created successfully."}
    except Exception:
        raise HTTPException(status_code=400, detail="Tag already exists or is invalid.")

@router.delete("/tags/{name}")
def delete_tag(name: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can manage tags.")
    conn, cursor = db
    # Delete from applications first to maintain consistency
    cursor.execute("DELETE FROM application_tags WHERE tag_name = %s", (name.strip(),))
    cursor.execute("DELETE FROM recruitment_tags WHERE name = %s", (name.strip(),))
    conn.commit()
    return {"message": f"Tag '{name}' deleted successfully."}

@router.get("/skills")
def get_dynamic_skills(current_user=Depends(get_current_user), db=Depends(get_db)):
    conn, cursor = db
    role = current_user.get("role")
    
    if role == "hr":
        # Fetch resumes strictly from applications belonging to this specific HR's jobs
        query = """
            SELECT r.extracted_text 
            FROM resumes r
            JOIN applications a ON r.candidate_id = a.candidate_id
            JOIN jobs j ON a.job_id = j.id
            WHERE j.hr_id = %s
        """
        cursor.execute(query, (current_user["user_id"],))
    else:
        # Candidate scoped skills (own resume)
        query = "SELECT extracted_text FROM resumes WHERE candidate_id = %s"
        cursor.execute(query, (current_user["user_id"],))
        
    resumes = cursor.fetchall()
    
    from parser_utils import get_all_skills
    known_skills = get_all_skills(cursor)
    
    skill_counts = {skill: 0 for skill in known_skills}
    total_resumes = len(resumes)
    
    if total_resumes > 0:
        for r in resumes:
            text = r["extracted_text"].lower() if r["extracted_text"] else ""
            for skill in known_skills:
                # Skill names might contain dot (React.js)
                pattern = rf"(?:^|[^a-zA-Z0-9]){re.escape(skill.lower())}(?:[^a-zA-Z0-9]|$)"
                if re.search(pattern, text):
                    skill_counts[skill] += 1
                    
    # Sort and pick top skills
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Filter out skills with 0 count so we only show skills that have active candidates
    active_skills = [(name, count) for name, count in sorted_skills if count > 0]
    
    if not active_skills:
        return []
        
    # Format all active skills dynamically using solid Hex Colors
    colors = ['#2563eb', '#06b6d4', '#4f46e5', '#10b981', '#8b5cf6', '#ec4899']
    trends = ['+15%', '+12%', '+8%', '+5%', '+3%', '+2%']
    
    formatted_skills = []
    for idx, (name, count) in enumerate(active_skills):
        formatted_skills.append({
            "name": name,
            "count": count,
            "trend": trends[idx % len(trends)],
            "color": colors[idx % len(colors)]
        })
    return formatted_skills


# 🔥 NEW: CANDIDATE RECRUITMENT TAGS ENDPOINTS

class AssignTagSchema(BaseModel):
    tag_name: str

@router.post("/applications/{app_id}/tags")
def assign_tag_to_candidate(app_id: int, payload: AssignTagSchema, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can assign tags to candidates")
    conn, cursor = db
    try:
        # Validate that application belongs to this HR's job posting
        cursor.execute("""
            SELECT j.hr_id 
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.id = %s
        """, (app_id,))
        job_owner = cursor.fetchone()
        if not job_owner:
            raise HTTPException(status_code=404, detail="Application not found")
        if job_owner["hr_id"] != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="You do not have permission to manage tags for this candidate")
            
        # Assign tag
        cursor.execute("INSERT IGNORE INTO application_tags (application_id, tag_name) VALUES (%s, %s)", (app_id, payload.tag_name.strip()))
        conn.commit()
        return {"message": "Tag assigned successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/applications/{app_id}/tags/{tag_name}")
def remove_tag_from_candidate(app_id: int, tag_name: str, current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can remove tags from candidates")
    conn, cursor = db
    try:
        # Validate ownership
        cursor.execute("""
            SELECT j.hr_id 
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.id = %s
        """, (app_id,))
        job_owner = cursor.fetchone()
        if not job_owner:
            raise HTTPException(status_code=404, detail="Application not found")
        if job_owner["hr_id"] != current_user["user_id"]:
            raise HTTPException(status_code=403, detail="You do not have permission to manage tags for this candidate")
            
        cursor.execute("DELETE FROM application_tags WHERE application_id = %s AND tag_name = %s", (app_id, tag_name.strip()))
        conn.commit()
        return {"message": "Tag removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
