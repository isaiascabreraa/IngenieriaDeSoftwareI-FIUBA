from typing import *
from .database import db, DataBase
from models.task import Task, TaskBase
from models.status import TaskStatus, ProjectStatus
from models.priority import Priority
from datetime import datetime
from .errors import *


class TaskHandler:
    def __init__(self, repository: DataBase) -> None:
        self.repository = repository

    async def validate_id_worker(self, worker_id: int):
        if not await self.repository.get_worker_by_id(worker_id):
            raise RefToNonExistentException(
                f"The employee (id:{worker_id}) given does not exist")

    async def validate_project(self, id_proj: int):
        proj = await self.repository.get_project_by_id(id_proj)
        if not proj:
            raise ActOnNonExistentException("Project not found")

    async def validate_form(self, task: TaskBase):
        await self.validate_project(task.project_id)

        if task.worker_id:
            await self.validate_id_worker(task.worker_id)

        if task.status not in TaskStatus._value2member_map_:
            raise DataValidationException("Invalid status")

        if task.priority not in Priority._value2member_map_:
            raise DataValidationException("Invalid priority")

        if task.start_date > task.end_date:
            raise DataValidationException(
                "End date must be greater than start date")

        if task.end_date < datetime.date(datetime.today()):
            raise DataValidationException("Invalid end date")

        if task.title == "":
            raise DataValidationException("Empty title!")

    async def validate_update(self, task_id: int, project_id: int, update: TaskBase):
        await self.get_task(task_id, project_id)
        await self.validate_form(update)

    async def get_all_tasks(self):
        r = await self.repository.fetch_all_tasks()
        r = [dict(x) for x in r]
        if not r:
            raise ActOnNonExistentException("No existing tasks")
        for task in r:
            project = await self.repository.get_project_by_id(task["project_id"])
            if not r:
                raise ActOnNonExistentException("Project not found")
            try:
                task["project_title"] = project["name"]
                task["project_status"] = project["status"]
            except:
                print("oaisndioansoid")
        return r

    async def get_task(self, id: int, project_id: int) -> Task:
        r = await self.repository.get_task_by_id(id, project_id)
        if not r:
            raise ActOnNonExistentException("Task not found")
        return Task(**(dict(r)))

    async def get_project_tasks(self, id: int) -> List[Task]:
        await self.validate_project(id)

        r = await self.repository.get_project_tasks(id)
        if not r:
            raise RefToNonExistentException(
                "No existing tasks for this project")
        return [Task(**(dict(x))) for x in r]

    async def validate_can_create(self, task: Task):
        if await self.repository.get_project_task_by_title(task.title, task.project_id):
            raise DuplicatedCreationException(
                f"Task already exists on project")

    async def create_task(self, task: TaskBase) -> None:
        await self.validate_form(task)
        await self.validate_can_create(task)
        await self.repository.create_task(task)

    async def delete_task(self, id: int, project_id: int) -> None:
        if await self.get_task(id, project_id):
            await self.repository.delete_task(id, project_id)

    async def update_task(self, id: int, project_id: int, task: TaskBase):
        await self.validate_update(id, project_id, task)
        await self.repository.update_task(id, project_id, task)


task_handler = TaskHandler(db)
