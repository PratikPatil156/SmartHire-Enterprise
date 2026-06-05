from fastapi import APIRouter, Depends
from database import get_db
from parser_utils import calculate_ats_score

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

@router.get("")
def get_leaderboard(db=Depends(get_db)):
    conn, cursor = db
    
    # 1. Fetch requirements for all active jobs
    cursor.execute("SELECT requirements FROM jobs")
    all_jobs = cursor.fetchall()
    
    # 2. Fetch all candidates and their resumes
    cursor.execute("""
        SELECT 
            u.id, u.name,
            r.extracted_text,
            (SELECT COUNT(*) FROM applications WHERE candidate_id = u.id) AS interviews
        FROM users u
        LEFT JOIN resumes r ON u.id = r.candidate_id
        WHERE u.role = 'candidate'
    """)
    rows = cursor.fetchall()
    
    rankings = []
    for row in rows:
        text = row["extracted_text"] if row["extracted_text"] else ""
        
        # Calculate candidate's BEST match score across all active jobs
        best_score = 0
        for job in all_jobs:
            reqs = [s.strip() for s in job['requirements'].split(',')] if job['requirements'] else []
            score_for_job = calculate_ats_score(text, reqs)
            if score_for_job > best_score:
                best_score = score_for_job
                
        score = float(best_score)
        
        rankings.append({
            "name": row["name"],
            "score": score,
            "interviews": row["interviews"]
        })
        
    # Sort rankings primarily by score descending, and secondarily by applications count descending
    rankings.sort(key=lambda x: (x["score"], x["interviews"]), reverse=True)
    
    # Limit to top 10 and add rank, level, trend
    final_rankings = []
    for idx, item in enumerate(rankings[:10]):
        level = "Expert" if item["score"] > 85 else ("Pro" if item["score"] > 60 else "Beginner")
        final_rankings.append({
            "rank": idx + 1,
            "name": item["name"],
            "score": item["score"],
            "level": level,
            "interviews": item["interviews"],
            "trend": "up" if idx % 2 == 0 else "down"
        })
        
    return final_rankings
