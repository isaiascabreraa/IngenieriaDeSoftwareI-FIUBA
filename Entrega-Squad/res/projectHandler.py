from typing import *
from .database import db, DataBase
from models.project import Project, ProjectBase
from models.status import ProjectStatus
from datetime import datetime
from .errors import *


class ProjectHandler:
    def __init__(self, repository:DataBase) -> None:
        self.repository:DataBase = repository


    async def validate_id_worker(self, worker_id:int):
        if not await self.repository.get_worker_by_id(worker_id):
            raise RefToNonExistentException(f"The employee given does not exist")


    async def validate_form(self, project:ProjectBase) -> None:
        if project.deadline < datetime.date(datetime.today()):
            raise DataValidationException(f"Invalid deadline")

        if project.aprox_time < 0:
            raise DataValidationException(f"Invalid time estimation")            
        
        if project.leader:
            await self.validate_id_worker(project.leader)

        if project.status not in ProjectStatus._value2member_map_:
            raise DataValidationException(f"Invalid status")


    async def validate_update(self, project_id:int, update:ProjectBase) -> None:
        proj = await self.get_project(project_id)
        await self.validate_form(update)


    async def get_project(self, id: int) -> Project:
        r = await self.repository.get_project_by_id(id)
        if not r:
            raise ActOnNonExistentException("Project not found")
        return Project(**(dict(r)))


    async def get_projects(self) -> List[Project]:
        r = await self.repository.fetch_all_projects()
        if r == []:
            raise RefToNonExistentException("No existing projects")
        return [Project(**(dict(x))) for x in r]


    async def get_projects_by_status(self,status) -> List[Project]:
        r = await self.repository.fetch_projects_by_status(status)
        if r == []:
            raise RefToNonExistentException("No existing projects with given status")
        return [Project(**(dict(x))) for x in r]


    async def create_project(self, project: ProjectBase) -> None:
        await self.validate_form(project)
        await self.repository.create_project(project)
    

    async def update_project(self, project_id: int, project: ProjectBase):
        await self.validate_update(project_id, project)
        await self.repository.update_project(project_id, project)



    async def delete_project(self, project_id: int):
        if await self.get_project(project_id):
            await self.repository.delete_project(project_id)

project_handler = ProjectHandler(db)
