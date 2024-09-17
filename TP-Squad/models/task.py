from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from .status import TaskStatus
from .priority import Priority

class TaskBase(BaseModel):
    project_id: int = 0
    worker_id: Optional[int] = 0
    title: str
    objective: str
    status: TaskStatus = TaskStatus.NEW
    priority: Priority = Priority.LOW
    start_date: date
    end_date: date

class Task(TaskBase):
    id: int