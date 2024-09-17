from typing import *
from .database import db
import sqlalchemy
from models.worker import Worker
from models.task import Task
from .errors import *
from .database import db,DataBase

class WorkerHandler():
    def __init__(self,repo) -> None:
        self.repository:DataBase = repo


    def build_worker(self, r):
        return Worker(id = r.get("legajo"),
                      name = r.get("Nombre"), 
                      last_name = r.get("Apellido"))

    async def get_worker(self, id:int) -> Worker:
        r = await self.repository.get_worker_by_id(id)
        return self.build_worker(r)

    async def get_workers(self) -> List[Worker]:
        r = await self.repository.get_all_workers()

        if(r == None): ## For now it means external error
            raise Exception("There was an unexpected error while requesting, try later.")

        if(len(r) == 0):
            raise Exception("There is no employees available")
            
        print(r, type(r))

        return [self.build_worker(x) for x in r]

worker_handler = WorkerHandler(db)