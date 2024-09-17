from fastapi import APIRouter, HTTPException
from models.project import *
from res.projectHandler import project_handler
from typing import List

router = APIRouter()

@router.get("/", response_model=List[Project])
async def get_projects():
    try:
        return await project_handler.get_projects()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{id}", response_model=Project)
async def get_project(id: int):
    try:
        return await project_handler.get_project(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_project(project: ProjectBase) -> None:
    try:
        return await project_handler.create_project(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{project_id}")
async def update_project(project_id:int, project:ProjectBase) -> None:
    try:
        return await project_handler.update_project(project_id, project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/{project_id}")
async def delete_project(project_id: int):
    try:
        return await project_handler.delete_project(project_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))