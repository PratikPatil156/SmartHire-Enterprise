from fastapi import APIRouter, Depends, HTTPException, Query
from database import get_db
from auth_utils import get_current_user
import re

router = APIRouter(prefix="/api/roadmap", tags=["Career Roadmap"])

@router.get("")
def get_roadmap(role: str = "Full Stack Developer", current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates have roadmaps")
    conn, cursor = db
    cursor.execute("SELECT extracted_text FROM resumes WHERE candidate_id = %s", (current_user["user_id"],))
    resume = cursor.fetchone()
    
    has_resume = True if resume else False
    text = resume["extracted_text"].lower() if (resume and resume["extracted_text"]) else ""
    
    # Skill catalogs
    fe_skills = ["html", "css", "javascript", "react", "vue", "angular", "tailwind", "next"]
    fw_skills = ["react", "vue", "angular", "tailwind", "bootstrap", "typescript"]
    be_skills = ["python", "node", "django", "flask", "fastapi", "spring", "sql", "postgres", "mysql"]
    do_skills = ["docker", "aws", "kubernetes", "system design", "scalability", "cloud", "devops"]
    
    ds_basics = ["python", "numpy", "pandas"]
    ds_viz = ["matplotlib", "seaborn", "sql", "query"]
    ds_ml = ["scikit-learn", "machine learning", "regression", "classification", "clustering"]
    ds_dl = ["tensorflow", "pytorch", "deep learning", "nlp", "neural network", "genai"]

    # Checks
    has_fe = any(s in text for s in fe_skills)
    has_fw = any(s in text for s in fw_skills)
    has_be = any(s in text for s in be_skills)
    has_do = any(s in text for s in do_skills)
    
    has_ds_b = any(s in text for s in ds_basics)
    has_ds_v = any(s in text for s in ds_viz)
    has_ds_m = any(s in text for s in ds_ml)
    has_ds_d = any(s in text for s in ds_dl)

    steps = []

    if role == "Frontend Developer":
        steps = [
          { "id": 1, "title": "Frontend Fundamentals", "topics": ["HTML5 Semantic Tags", "CSS3 Flexbox/Grid", "ES6+ JavaScript"], "status": "completed" if (has_resume and has_fe) else "current" },
          { "id": 2, "title": "Modern Frameworks", "topics": ["React Hooks & Context", "Zustand/Redux State", "Tailwind CSS"], "status": "completed" if (has_resume and has_fw) else ("current" if (has_resume and has_fe) else "locked") },
          { "id": 3, "title": "Advanced Web Apps", "topics": ["Next.js (SSR/Static)", "Unit Testing (Jest)", "Web Performance Optimization"], "status": "completed" if (has_resume and ("next" in text or "jest" in text)) else ("current" if (has_resume and has_fw) else "locked") },
          { "id": 4, "title": "Frontend DevOps", "topics": ["CI/CD for Web", "Netlify/Vercel Deployment", "Web Security (CORS/XSS)"], "status": "completed" if (has_resume and has_do) else ("current" if (has_resume and ("next" in text or "jest" in text)) else "locked") }
        ]
    elif role == "Backend Developer":
        steps = [
          { "id": 1, "title": "Backend Basics", "topics": ["Python / Node.js Syntax", "HTTP Protocol & REST Basics", "CLI and Git Version Control"], "status": "completed" if (has_resume and ("python" in text or "node" in text or "git" in text)) else "current" },
          { "id": 2, "title": "API Development", "topics": ["RESTful APIs (FastAPI/Express)", "SQL Basics & MySQL/PostgreSQL", "Authentication (JWT & OAuth)"], "status": "completed" if (has_resume and has_be) else ("current" if (has_resume and ("python" in text or "node" in text)) else "locked") },
          { "id": 3, "title": "Caching & Scale", "topics": ["Redis Caching", "Docker Containerization", "Message Queues (RabbitMQ/Kafka)"], "status": "completed" if (has_resume and ("docker" in text or "redis" in text)) else ("current" if (has_resume and has_be) else "locked") },
          { "id": 4, "title": "Production DevOps", "topics": ["AWS Cloud Deployment", "Kubernetes Orchestration", "CI/CD & Monitoring"], "status": "completed" if (has_resume and has_do) else ("current" if (has_resume and ("docker" in text or "redis" in text)) else "locked") }
        ]
    elif role == "Data Scientist":
        steps = [
          { "id": 1, "title": "Data Manipulation", "topics": ["Python Programming Basics", "NumPy Numerical Arrays", "Pandas DataFrames"], "status": "completed" if (has_resume and has_ds_b) else "current" },
          { "id": 2, "title": "Data Visualization & SQL", "topics": ["Matplotlib & Seaborn Plots", "SQL Database Queries", "Exploratory Data Analysis (EDA)"], "status": "completed" if (has_resume and has_ds_v) else ("current" if (has_resume and has_ds_b) else "locked") },
          { "id": 3, "title": "Machine Learning", "topics": ["Scikit-learn Models", "Feature Engineering & Tuning", "Supervised/Unsupervised Models"], "status": "completed" if (has_resume and has_ds_m) else ("current" if (has_resume and has_ds_v) else "locked") },
          { "id": 4, "title": "Advanced AI & Deployment", "topics": ["Deep Learning (TensorFlow/PyTorch)", "NLP & GenAI/Large Language Models", "Model API Deployment"], "status": "completed" if (has_resume and has_ds_d) else ("current" if (has_resume and has_ds_m) else "locked") }
        ]
    else: # Full Stack Developer (Default)
        steps = [
          { "id": 1, "title": "Frontend Fundamentals", "topics": ["HTML5 Semantic Tags", "CSS3 Flexbox/Grid", "ES6+ JavaScript"], "status": "completed" if (has_resume and has_fe) else "current" },
          { "id": 2, "title": "Modern Frameworks", "topics": ["React Hooks", "State Management (Redux/Zustand)", "Tailwind CSS"], "status": "completed" if (has_resume and has_fw) else ("current" if (has_resume and has_fe) else "locked") },
          { "id": 3, "title": "Backend & APIs", "topics": ["RESTful APIs", "SQL / NoSQL Databases", "Python / Node.js Backend"], "status": "completed" if (has_resume and has_be) else ("current" if (has_resume and has_fw) else "locked") },
          { "id": 4, "title": "System Design & DevOps", "topics": ["Scalability & Cache", "Docker Basics", "AWS Cloud Deployment"], "status": "completed" if (has_resume and has_do) else ("current" if (has_resume and has_be) else "locked") }
        ]

    return {
        "has_resume": has_resume,
        "role_target": role,
        "steps": steps
    }
