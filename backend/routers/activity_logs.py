from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from auth_utils import get_current_user
from datetime import datetime

router = APIRouter(prefix="/api/activity-logs", tags=["Activity Logs"])

def get_relative_time(dt):
    if not isinstance(dt, datetime):
        return "Recent"
    diff = datetime.now() - dt
    seconds = diff.total_seconds()
    if seconds < 0:
        return "Just now"
    if seconds < 60:
        return "Just now"
    elif seconds < 3600:
        return f"{int(seconds // 60)} mins ago"
    elif seconds < 86400:
        hours = int(seconds // 3600)
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif seconds < 172800:
        return "Yesterday"
    else:
        return dt.strftime("%b %d, %Y")

@router.get("")
def get_activity_logs(current_user=Depends(get_current_user), db=Depends(get_db)):
    conn, cursor = db
    
    # 1. Fetch current user's name from database
    cursor.execute("SELECT name FROM users WHERE id = %s", (current_user["user_id"],))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_name = user["name"]
    role = current_user.get("role")
    
    # 2. Select logs depending on role
    if role == "hr":
        cursor.execute("""
            SELECT * FROM activity_logs 
            WHERE user_name = %s AND (LOWER(role) = 'hr' OR LOWER(role) = 'recruiter')
            ORDER BY id DESC LIMIT 50
        """, (user_name,))
    else:
        # Candidate notifications: exclude administrative logs ('Logged In', 'Registered', 'Updated Profile')
        cursor.execute("""
            SELECT * FROM activity_logs 
            WHERE (
                (user_name = %s AND LOWER(role) = 'candidate' AND action NOT IN ('Logged In', 'Registered', 'Updated Profile'))
                OR (target = %s AND (LOWER(role) LIKE '%hr%' OR LOWER(role) LIKE '%recruiter%') AND action NOT IN ('Logged In', 'Registered', 'Updated Profile', 'Posted Job', 'Deleted Job', 'Updated Job'))
            )
            ORDER BY id DESC LIMIT 50
        """, (user_name, user_name))
        
    logs = cursor.fetchall()
    
    if not logs:
        return []
        
    formatted_logs = []
    for log in logs:
        formatted_logs.append({
            "id": log["id"],
            "type": log["event_type"],
            "user": log["user_name"],
            "action": log["action"],
            "target": log["target"],
            "role": log["role"],
            "time": get_relative_time(log["created_at"]),
            "details": log["details"]
        })
    return formatted_logs

@router.delete("/clear")
def clear_activity_logs(current_user=Depends(get_current_user), db=Depends(get_db)):
    if current_user.get("role") != "hr":
        raise HTTPException(status_code=403, detail="Only HR can clear audit logs.")
    conn, cursor = db
    cursor.execute("TRUNCATE TABLE activity_logs")
    conn.commit()
    return {"message": "Audit logs cleared successfully."}
