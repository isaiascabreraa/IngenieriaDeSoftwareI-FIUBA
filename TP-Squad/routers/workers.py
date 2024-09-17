from fastapi import APIRouter, HTTPException
from models.worker import *
from models.task import Task
from typing import List
import sys
from res.workerHandler import worker_handler

router = APIRouter()

@router.get("/", response_model=List[Worker])
async def get_all_workers() -> List[Worker]:
    try:
        return await worker_handler.get_workers()
    except Exception as e:
        _,_,l = sys.exc_info()
        raise HTTPException(status_code=500, detail=f"{e}, {l.tb_lineno}")

@router.get("/{id}", response_model=Worker)
async def get_worker_by_id(id: int):
    try:
        return await worker_handler.get_worker(id)
    except Exception as e:
        _,_,l = sys.exc_info()
        raise HTTPException(status_code=500, detail=f"{e}, {l.tb_lineno}")