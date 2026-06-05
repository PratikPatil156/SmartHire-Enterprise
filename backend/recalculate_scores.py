import mysql.connector
import os
import sys
from dotenv import load_dotenv

# Ensure we can import parser_utils from current directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from parser_utils import calculate_ats_score

load_dotenv()

def recalculate():
    print("Connecting to database...")
    conn = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "Pratik@143"),
        database=os.getenv("DB_NAME", "smarthire_db")
    )
    cursor = conn.cursor(dictionary=True)
    
    # Fetch all jobs to use for matching
    cursor.execute("SELECT requirements FROM jobs")
    jobs = cursor.fetchall()
    print(f"Fetched {len(jobs)} jobs from database.")
    
    # Fetch all resumes
    cursor.execute("SELECT id, candidate_id, file_name, extracted_text FROM resumes")
    resumes = cursor.fetchall()
    print(f"Fetched {len(resumes)} resumes to update.")
    
    for resume in resumes:
        text = resume["extracted_text"] if resume["extracted_text"] else ""
        
        # Calculate average ATS score across all jobs
        total_score = 0
        for job in jobs:
            req_skills = [s.strip() for s in job['requirements'].split(',')] if job['requirements'] else []
            match_percentage = calculate_ats_score(text, req_skills)
            total_score += match_percentage
            
        overall_score = int(total_score / len(jobs)) if jobs else 0
        
        print(f"Updating resume ID {resume['id']} (Candidate {resume['candidate_id']}): {resume['file_name']} -> New Score: {overall_score}")
        cursor.execute("UPDATE resumes SET overall_score = %s WHERE id = %s", (overall_score, resume["id"]))
        
    conn.commit()
    cursor.close()
    conn.close()
    print("All scores successfully updated and database committed!")

if __name__ == "__main__":
    recalculate()
