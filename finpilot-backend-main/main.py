from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import salary, dashboard, goals, auth, wrapped

app = FastAPI(title="Finance AI Backend")

# CORS Setup (Allowing all for hackathon convenience)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(salary.router)
app.include_router(dashboard.router)
app.include_router(goals.router)
app.include_router(wrapped.router)

@app.get("/")
def root():
    return {"message": "Finance AI Backend is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)