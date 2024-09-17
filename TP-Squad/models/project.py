from pydantic import BaseModel
from datetime import date
from typing import Optional
from .status import ProjectStatus

class ProjectBase(BaseModel):
    name: str
    objective: str
    deadline: date
    leader: Optional[int] = None
    aprox_time: Optional[int] = 0
    status: ProjectStatus

class Project(ProjectBase):
    id: int