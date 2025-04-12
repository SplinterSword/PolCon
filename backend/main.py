from utils.get_contradictory_news import get_contradiction_news, get_contradiction_news_groq
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
import os

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Politician(BaseModel):
    name: str

    class Config:
        extra = "forbid"

@app.get("/")
def read_root():
    return {"message": "Welcome to your FastAPI backend!"}

@app.post("/getContradictions")
def read_item(politician: Politician):
    name = politician.name
    contradictions = get_contradiction_news(name)
    return contradictions

port = int(os.environ.get("PORT", 8000))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)