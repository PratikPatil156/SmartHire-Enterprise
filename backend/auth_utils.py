import os
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Header
from dotenv import load_dotenv

load_dotenv()

# JWT Configurations
JWT_SECRET = os.getenv("JWT_SECRET", "smarthire_super_secret_key_123")
JWT_ALGORITHM = "HS256"

# Token Generate karne ka function
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24) # Token 24 ghante tak valid rahega
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

# JWT Authentication Dependency Helper
def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    try:
        # Expected format: "Bearer <token>"
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
