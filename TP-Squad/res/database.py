import os
import databases
import sqlalchemy
from typing import Optional
import aiohttp
from models.project import *
from models.task import *
from models.worker import *

"""
Get up to 16/03/2024
[
    {
        "legajo": 1,
        "Nombre": "Mario",
        "Apellido": "Mendoza"
    },
    {
        "legajo": 2,
        "Nombre": "Maria",
        "Apellido": "Perez"
    },
    {
        "legajo": 3,
        "Nombre": "Patricia",
        "Apellido": "Gaona"
    }
]
"""
WORKERS_SERVICE = "https://anypoint.mulesoft.com/mocking/api/v1/sources/exchange/assets/754f50e8-20d8-4223-bbdc-56d50131d0ae/recursos-psa/1.0.0/m/api/recursos"


class DataBase():
    def __init__(self, db_path: Optional[str] = None) -> None:
        self.db = None
        self.project_table = None
        self.worker_table = None
        self.task_table = None
        self.main(db_path)

    def main(self, db_path: Optional[str] = None) -> None:
        module_dir = os.path.dirname(__file__)  # get current directory
        db_dir = os.path.join(module_dir, "..", "database.db")
        if db_path:
            db_dir = db_path
        DATABASE_URL = "sqlite:///"+db_dir                                # Database URL
        print("DATABASE_URL =", DATABASE_URL)

        # Create database object
        self.db = databases.Database(DATABASE_URL)

        engine = sqlalchemy.create_engine(                                      # Create engine
            DATABASE_URL, connect_args={"check_same_thread": False})

        # Create metadata object
        md = sqlalchemy.MetaData()

        self.project_table = sqlalchemy.Table(
            "project_table",
            md,
            sqlalchemy.Column("id", sqlalchemy.INTEGER, primary_key=True),
            sqlalchemy.Column("name", sqlalchemy.String),
            sqlalchemy.Column("objective", sqlalchemy.TEXT),
            sqlalchemy.Column("deadline", sqlalchemy.DATE),
            sqlalchemy.Column(
                "leader", sqlalchemy.ForeignKey("worker_table.id")),
            sqlalchemy.Column("aprox_time", sqlalchemy.INTEGER),
            sqlalchemy.Column("status", sqlalchemy.INTEGER),
        )

        self.worker_table = sqlalchemy.Table(
            "worker_table",
            md,
            sqlalchemy.Column("id", sqlalchemy.INTEGER, primary_key=True),
        )

        self.task_table = sqlalchemy.Table(  # Create task table
            "task_table",
            md,
            sqlalchemy.Column("id", sqlalchemy.INTEGER),
            sqlalchemy.Column(
                "project_id", sqlalchemy.ForeignKey(
                    "project_table.id", ondelete="CASCADE")
            ),
            sqlalchemy.Column(
                "worker_id", sqlalchemy.ForeignKey("worker_table.id")),
            sqlalchemy.Column("title", sqlalchemy.TEXT),
            sqlalchemy.Column("objective", sqlalchemy.TEXT),
            sqlalchemy.Column("status", sqlalchemy.INTEGER),
            sqlalchemy.Column("priority", sqlalchemy.INTEGER),
            sqlalchemy.Column("start_date", sqlalchemy.DATE),
            sqlalchemy.Column("end_date", sqlalchemy.DATE),
            sqlalchemy.PrimaryKeyConstraint("id", "project_id")
        )

        md.create_all(engine)   # Create tables

    async def load_default(self):
        import random
        workers = await self.workers_endpoint()
        worker = random.choice(workers)
        if (await self.db.fetch_all(self.project_table.select())
            or await self.db.fetch_all(self.task_table.select())
                or await self.db.fetch_all(self.worker_table.select())):
            print("Already existing DB.")
            return

        try:
            await self.db.execute(self.project_table.insert().values(dict(ProjectBase(name="Multipurpose hybrid boat engine",
                                                                                      objective="Creating a cutting-edge multipurpose hybrid boat engine that integrates combustion and electric propulsion technologies to deliver superior efficiency, minimized environmental impact, and adaptable performance across various marine applications.",
                                                                                      deadline="2024-06-21",
                                                                                      leader=worker["legajo"],
                                                                                      aprox_time=365,
                                                                                      status=ProjectStatus.IN_PROCESS))))

            await self.db.execute(self.project_table.insert().values(dict(ProjectBase(name="Blockchain-based home security system",
                                                                                      objective="Conventional home security systems, while valuable, have limitations. Centralized data storage creates vulnerabilities, and homeowners often lack control over their security information. Blockchain technology offers a groundbreaking solution.\nImagine a decentralized system where sensor data from your smart home devices (doors, windows, cameras) is encrypted and stored on a secure blockchain network. This distributed ledger makes tampering nearly impossible, unlike traditional centralized servers. Homeowners hold the private keys to their data, granting them unprecedented control. They can decide who has access (security companies, emergency responders) and for what purpose. Every interaction with the system, from alarms to setting changes, is recorded on the blockchain, creating an immutable audit trail for enhanced transparency and accountability.\nSmart contracts, self-executing programs on the blockchain, further elevate security. This transformative approach empowers homeowners, fosters transparency, and automates security responses. By harnessing the power of blockchain technology, we can create a future where homes are safer and more secure than ever before. ",
                                                                                      deadline="2024-07-21",
                                                                                      aprox_time=0,
                                                                                      status=ProjectStatus.NEW))))

            await self.db.execute(self.task_table.insert().values(dict(Task(id=1,
                                                                            project_id=1,
                                                                            worker_id=worker["legajo"],
                                                                            title="Development of Prototype",
                                                                            objective="Design and build a prototype hybrid boat engine that integrates combustion and electric propulsion systems, aiming to achieve enhanced fuel efficiency, reduced emissions, and versatile operational capabilities suitable for diverse marine environments.",
                                                                            status=TaskStatus.NEW,
                                                                            priority=Priority.LOW,
                                                                            start_date="2024-06-21",
                                                                            end_date="2024-06-22"))))

            await self.db.execute(self.task_table.insert().values(dict(Task(id=2,
                                                                            project_id=1,
                                                                            title="Maximize battery life",
                                                                            objective="The system should optimize battery charging and discharging cycles to prolong battery health and capacity.",
                                                                            status=TaskStatus.BLOCKED,
                                                                            priority=Priority.MODERATE,
                                                                            start_date="2024-06-21",
                                                                            end_date="2024-06-22"))))

            await self.db.execute(self.task_table.insert().values(dict(Task(id=1,
                                                                            project_id=2,
                                                                            worker_id=worker["legajo"],
                                                                            title="Key Management",
                                                                            objective="Develop a mechanism for homeowners to manage their private keys securely. This might involve integrating a secure key storage solution or user-friendly key management tools within the platform",
                                                                            status=TaskStatus.IN_PROCESS,
                                                                            priority=Priority.LOW,
                                                                            start_date="2024-01-21",
                                                                            end_date="2024-07-22"))))

            await self.db.execute(self.task_table.insert().values(dict(Task(id=2,
                                                                            project_id=2,
                                                                            title="Secure User Authentication",
                                                                            objective="Integrate a secure user authentication system that verifies user identities before granting access to the platform. This could involve multi-factor authentication (MFA) for added security.",
                                                                            status=TaskStatus.CLOSED,
                                                                            priority=Priority.HIGH,
                                                                            start_date="2023-06-21",
                                                                            end_date="2024-06-22"))))

            await self.db.execute(self.worker_table.insert().values(dict(WorkerBase(id=worker["legajo"]))))
            print("Default values loaded.")
        except:
            print("Already existing DB.")

    # ----------------------------------------FETCHERS----------------------------------------
    async def fetch_one(self, query):
        return await self.db.fetch_one(query)

    async def fetch_all(self, query):
        return await self.db.fetch_all(query)

    # ----------------------------------------PROJECT----------------------------------------
    async def fetch_all_projects(self):
        return await self.fetch_all(self.project_table.select())

    async def fetch_projects_by_status(self, status: int):
        return await self.fetch_all(self.project_table.select().where(sqlalchemy.sql.column("status") == status))

    async def get_project_by_id(self, id: int):
        return await self.fetch_one(self.project_table.select().where(sqlalchemy.sql.column("id") == id))

    async def get_projects_by_name(self, name: str):
        return await self.fetch_all(self.project_table.select().where(sqlalchemy.sql.column("name") == name))

    async def get_project_by_name(self, name: str):
        return await self.fetch_one(self.project_table.select().where(sqlalchemy.sql.column("name") == name))

    async def create_project(self, project: ProjectBase):
        await self.db.execute(self.project_table.insert().values(dict(project)))

    async def update_project(self, project_id: int, project: ProjectBase):
        await self.db.execute(self.project_table.update().where(sqlalchemy.sql.column("id") == project_id).values(dict(project)))

    async def delete_project(self, project_id: int):
        await self.db.execute(self.project_table.delete().where(sqlalchemy.sql.column("id") == project_id))

    # ----------------------------------------TASK----------------------------------------
    async def fetch_all_tasks(self):
        return await self.fetch_all(self.task_table.select())

    async def get_task_by_id(self, id: int, project_id: int):
        return await self.fetch_one(self.task_table.select().where(sqlalchemy.sql.column("id") == id,
                                                                   sqlalchemy.sql.column("project_id") == project_id))

    async def get_project_task_by_title(self, title: str, project_id: int):
        return await self.fetch_one(self.task_table.select().where(sqlalchemy.sql.column("title") == title,
                                                                   sqlalchemy.sql.column("project_id") == project_id))

    async def get_project_tasks(self, id: int):
        return await self.fetch_all(self.task_table.select().where(sqlalchemy.sql.column("project_id") == id))

    async def create_task(self, task: TaskBase):
        query = sqlalchemy.select(sqlalchemy.func.max(self.task_table.c.id)).where(
            sqlalchemy.sql.column("project_id") == task.project_id)
        result = await self.db.fetch_one(query)
        last_task_id = result[0] if result[0] is not None else 0
        task = Task(id=last_task_id+1, **(dict(task)))
        await self.db.execute(self.task_table.insert().values(dict(task)))

    async def delete_task(self, id: int, project_id: int):
        await self.db.execute(self.task_table.delete().where(sqlalchemy.sql.column("id") == id,
                                                             sqlalchemy.sql.column("project_id") == project_id))

    async def update_task(self, id: int, project_id: int, task: TaskBase):
        await self.db.execute(self.task_table.update().where(sqlalchemy.sql.column("id") == id,
                                                             sqlalchemy.sql.column("project_id") == project_id).values(dict(task)))

    # ----------------------------------------WORKER----------------------------------------
    async def add_worker_if_not_exists(self, worker_id: int):
        if not await self.db.fetch_one(self.worker_table.select().where(sqlalchemy.sql.column("id") == worker_id)):
            await self.db.execute(self.worker_table.insert().values(dict(WorkerBase(id=worker_id))))

    async def delete_worker(self, worker_id: int):
        if await self.db.fetch_one(self.worker_table.select().where(sqlalchemy.sql.column("id") == worker_id)):
            await self.db.execute(self.worker_table.delete().where(sqlalchemy.sql.column("id") == worker_id))

    async def workers_endpoint(self):
        async with aiohttp.ClientSession() as session:
            async with session.get(WORKERS_SERVICE) as response:
                r = await response.json()
                if not r:
                    raise Exception("Workers service not working")
        return r

    async def get_all_workers(self):
        return await self.workers_endpoint()

    async def get_worker_by_id(self, worker_id: int):
        r = await self.workers_endpoint()
        for w in r:
            if w["legajo"] == worker_id:
                await self.add_worker_if_not_exists(worker_id)
                return w
        await self.delete_worker(worker_id)
        raise Exception("Worker not found")

# Initialize database


db = DataBase()
