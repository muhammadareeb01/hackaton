from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.get("/")
def read_root():
    return {"status": "success", "message": "CleanWater Access Tracker Backend is live!"}

@app.post("/api/login")
def login(data: LoginRequest):
    if data.username == "admin" and data.password == "admin123":
        return {"status": "success", "message": "Login successful!", "token": "fake-jwt-token"}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
