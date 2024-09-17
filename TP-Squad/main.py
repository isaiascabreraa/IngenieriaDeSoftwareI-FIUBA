import colorama

colorama.init()

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging as log
from routers import projects
from routers import tasks
from routers import workers
from res.database import db
from contextlib import asynccontextmanager

log.basicConfig(filename='log.log', level=log.INFO, format='%(asctime)s:%(levelname)s:%(message)s')


@asynccontextmanager
async def startup(app: FastAPI):
    await db.load_default()
    yield


app = FastAPI(lifespan=startup, title="PSA - Manager de Proyectos")
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(workers.router, prefix="/workers", tags=["workers"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://psa-project-microservice.onrender.com",
        "http://psa-project-microservice.onrender.com",
        "http://localhost:8000",
        "https://localhost:8000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    print("APP START")
    uvicorn.run(app, host="0.0.0.0", port=8000, loop="asyncio")
