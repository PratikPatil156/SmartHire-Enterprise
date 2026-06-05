from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import auth, jobs, applications, resume, leaderboard, roadmap, hr, activity_logs, skills_tags, profile

# Initialize DB on startup
init_db()

app = FastAPI(title="SmartHire API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route
@app.get("/")
def home():
    return {"status": "SmartHire Backend is Running Successfully!"}

# Include all APIRouters under their respective prefixes and tags
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(resume.router)
app.include_router(leaderboard.router)
app.include_router(roadmap.router)
app.include_router(hr.router)
app.include_router(activity_logs.router)
app.include_router(skills_tags.router)
app.include_router(profile.router)