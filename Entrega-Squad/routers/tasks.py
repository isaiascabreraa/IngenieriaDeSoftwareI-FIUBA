from fastapi import APIRouter, HTTPException
from models.task import Task, TaskBase
from res.taskHandler import task_handler
from typing import List

router = APIRouter()

@router.get("/", response_model=list)
async def get_all_tasks():
    try:
        return await task_handler.get_all_tasks()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{project_id}", response_model=List[Task])
async def get_project_tasks(project_id:int):
    try:
        return await task_handler.get_project_tasks(project_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{project_id}/{task_id}", response_model=Task)
async def get_task(project_id:int, task_id:int):
    try:
        return await task_handler.get_task(id=task_id, project_id=project_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def create_task(task:TaskBase):
    try:
        return await task_handler.create_task(task)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/{project_id}/{task_id}")
async def delete_task(project_id:int, task_id:int):
    try:
        return await task_handler.delete_task(task_id, project_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.patch("/{project_id}/{task_id}")
async def update_task(project_id:int, task_id:int, task:TaskBase):
    try:
        return await task_handler.update_task(task_id, project_id, task)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))