from pydantic import BaseModel

class WorkerBase(BaseModel):
    id: int
class Worker(BaseModel):
    id: int
    name: str
    last_name: str