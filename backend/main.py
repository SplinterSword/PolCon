from utils.get_contradictory_news import get_contradiction_news
from fastapi import FastAPI
from pydantic import BaseModel
import os

app = FastAPI()

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)