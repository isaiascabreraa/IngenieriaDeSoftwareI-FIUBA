import logging
from models.project import Project, ProjectBase
from models.task import Task, TaskBase
from models.worker import Worker, WorkerBase
import datetime
from models.status import *

DEFAULT_ID_LEADER = None


class MockProjectRepository:

    def __init__(self, *projects):
        self.projects = list(projects)
        self.workers = None


    def add_new_project(self, project):
        self.projects.append(project)   


    def add_worker_new(self, ide_worker):
        self.workers.append(int(ide_worker))





    def find_by_name(self, name):
        res = []
        for project in self.projects:
            if(project.name == name):
                res.append(project)

        return None if len(res) == 0 else res 

    def single_by_name(self, name):
        for project in self.projects:
            if(project.name == name):
                print_info("FOUND RES WITH NAMEEEE ",name, project)
                return project

        return None

    def single_by_id(self, ide:int):
        for project in self.projects:
            if(project.id == int(ide)):
                return project

        return None


    def __repr__(self):
        res = "repo "
        for proj in self.projects:
            res+="\n"+str(proj)

        return res

    async def fetch_all_projects(self):
        return self.projects

    async def get_project_by_id(self, ide:int):
        return self.single_by_id(ide)
    
    async def get_project_by_name(self, name:str):
        return self.find_by_name(name)

    async def first_project_by_name(self, name:str):
        return self.single_by_name(name)


    async def fetch_projects_by_status(self, status:int):
        res = []
        for project in self.projects:
            if(project.status == status):
                res.append(project)

        return res

    async def create_project(self, project):
        self.projects.append(project)   



    def index_by_id(self, ide:int):
        for indx in range(len(self.projects)):
            if(self.projects[indx].id == int(ide)):
                return indx

        return None
    async def delete_project(self, ide:int):
        res = self.index_by_id(ide)
        if (res != None):
            self.projects.pop(res)


    async def update_project(self, ide:int, project:ProjectBase):
        res = self.index_by_id(ide)
        if (res != None):
            self.projects[res] = project


    async def assign_leader_project(self, project_id:int, leader_id:int):
        self.single_by_id(project_id).leader = leader_id


    async def get_worker_by_id(self, ide_worker):
        return await self.workers.get_worker_by_id(ide_worker)





class MockTaskRepository:

    def __init__(self, project_rep, *tasks):
        self.tasks = list(tasks)
        self.workers = []
        self.projects = project_rep



    def add_worker_new(self, ide_worker):
        self.workers.append(int(ide_worker))


    #def add_project_new(self, project_id:int):
    #    self.projects.add_new_project(int(project_id))

    #def add_project_if_not_exists(self, project_id:int):
    #    id = int(project_id)
    #    if not project_id in self.projects:
    #        self.projects.append(project_id)



    def add_new_task(self, task):
        self.tasks.append(task)   

    async def get_project_by_id(self, ide):
        return await self.projects.get_project_by_id(ide) #ide if ide in self.projects else None


    def find_by_name(self, title, id_proj):
        res = []
        for task in self.tasks:
            if(task.title == title and task.project_id == id_proj):
                res.append(task)

        return None if len(res) == 0 else res 

    def single_by_name(self, title):
        for task in self.tasks:
            if(task.title == title):
                print_info("FOUND RES WITH NAMEEEE ",title, task)
                return task

        return None


    def by_project_id(self, ide :int):
        ide = int(ide)
        res = []
        for task in self.tasks:
            if(task.project_id == ide):
                res.append(task)

        return res


    def single_by_id(self, ide:int, ide_project: int):
        for task in self.tasks:
            #print("INFO task ", task.id == int(ide), ide, task.id)
            if(task.id == int(ide) and task.project_id == ide_project):
                return task

        return None

    def index_by_id(self, ide:int, ide_project: int):
        for indx in range(len(self.tasks)):
            if(self.tasks[indx].id == int(ide) and self.tasks[indx].project_id== ide_project):
                return indx

        return None



    def __repr__(self):
        res = "repo "
        for proj in self.tasks:
            res+="\n"+str(proj)

        return res

    async def fetch_all_tasks(self):
        return self.tasks
    
    async def get_task_by_id(self, ide:int, ide_project: int):
        return self.single_by_id(ide,ide_project)

    async def get_project_tasks(self, ide:int):
        return self.by_project_id(ide)
    
    async def create_task(self, task:TaskBase):
        self.tasks.append(task)

    async def delete_task(self, ide:int, ide_project: int):
        res = self.index_by_id(ide,ide_project)
        if (res != None):
            self.tasks.pop(res)


    async def update_task(self, ide:int, ide_project: int, task:TaskBase):
        res = self.index_by_id(ide,ide_project)
        if (res != None):
            self.tasks[res] = task

    async def get_project_task_by_title(self, name:str, project_id:int):
        return self.find_by_name(name, project_id)

    async def get_worker_by_id(self, ide_worker):
        return await self.workers.get_worker_by_id(ide_worker)



class MockRepositoryWorkers:
    def __init__(self, *workers):
        self.workers = list(workers)
        self.is_working = True


    def set_is_working(self, is_working):
        self.is_working = is_working

    def append(self,worker):
        self.workers.append(worker)


    def single_by_id(self, ide:int):
        for worker in self.workers:
            #print("INFO task ", task.id == int(ide), ide, task.id)
            if(worker.id == int(ide)):
                return self.parse_worker_to_dict(worker)

        return None


    def parse_worker_to_dict(self, worker): # AL formato del servicio extenro!
            return {
            "legajo": worker.id,
            "Nombre": worker.name,
            "Apellido": worker.last_name
            }



    async def get_worker_by_id(self, ide):
        return self.single_by_id(ide)

    async def get_all_workers(self):
        return list(self.parse_worker_to_dict(w) for w in self.workers) if self.is_working else None

    def exists_worker(self, ide):
        return single_by_id(ide) != None

def print_info(*args, **kwargs):
    print(*args, **kwargs)
    #logging.info(*args, **kwargs)


def create_projects_repository(*args):
    return MockProjectRepository(*args)



def create_tasks_repository(proj_rep, *args):
    return MockTaskRepository(proj_rep, *args)

def parse_status(status):
    if status.lower() == "new":
        return ProjectStatus.NEW

    if status.lower() == "in progress":
        return ProjectStatus.IN_PROCESS

    if status.lower() == "closed":
        return ProjectStatus.CLOSED

    return -1



def parse_status_task(status):
    if status.lower() == "new":
        return TaskStatus.NEW

    if status.lower() == "in progress":
        return TaskStatus.IN_PROCESS

    if status.lower() == "closed":
        return TaskStatus.CLOSED

    if status.lower() == "blocked":
        return TaskStatus.BLOCKED

    return -1 ## INVALID?!


def create_worker(ide, name):
    return Worker(id = ide, name = name,last_name = "")

def parse_worker(name):
    if name == "Isaias":
        return create_worker(1, name)
    if name == "Maximiliano":
        return create_worker(2, name)

    if name == "Marcelo":
        return create_worker(3, name)

    if name == "Federico":
        return create_worker(4, name)

    if name == "None":
        return None

    return create_worker(-1, name)


def parse_worker_id(name):
    res = parse_worker(name)
    return DEFAULT_ID_LEADER if res == None else res.id



def parse_original(name):
    return "original: "+name

def parse_project_from_name(context,name, original = True):

    if(original):
        name = parse_original(name)

    return context.projects_map[name] if name in context.projects_map else -1

def map_project_on(context , project,original = True):
    context.projects_map[parse_original(project.name) if original else project.name] = project.id

        
def append_context_project(context, project, original):
    if(context != None):
        map_project_on(context, project,original = original)
        context.repository.add_new_project(project)
      

def parse_deadline(deadline):
    return datetime.datetime.strptime(deadline, "%Y-%m-%d").date()

def create_project_general(ide, data, context = None,original = True):
    proj= Project(id =ide, name = data["name"],
        objective = data["objective"], deadline = parse_deadline(data["deadline"]),
        leader = parse_worker_id(data["leader"]), aprox_time = int(data["aprox_time"][:-1]), status = parse_status(data["status"]))
    append_context_project(context, proj,original = original)

    return proj

def create_project_name(ide:int, name:str, leader_id = DEFAULT_ID_LEADER, context = None,original = True):
    proj= Project(id = ide, name = name,
        objective = "", deadline = datetime.datetime(2025, 3, 12), leader = leader_id, aprox_time = 1, status = ProjectStatus.NEW)
    append_context_project(context, proj,original = original)

    return proj


def create_project_leader(ide:int, leader_id:int = DEFAULT_ID_LEADER, context = None,original = True):

    proj= Project(id = ide, name = "SOME NAME"+str(ide),
        objective = "", deadline = datetime.datetime(2025, 3, 12), leader = leader_id, aprox_time = 1, status = ProjectStatus.NEW)

    append_context_project(context, proj,original = original)

    return proj



#tasks_map = {}

def parse_key_task(proj_id, title):
    return str(proj_id)+"_"+title

def parse_task_from_title(context, title, proj_name):
    key = parse_key_task(parse_project_from_name(context, proj_name), title)
    return context.tasks_map[key] if key in context.tasks_map else -1

def map_task_on(context, task):
    context.tasks_map[parse_key_task(task.project_id, task.title)] = task.id


def append_context_task(context, task):
    if(context != None):
        map_task_on(context, task)
        context.repository_tasks.add_new_task(task)
  

def create_task_general(ide, proj_id, data, context = None):
    print_info("DATA HAS ", data.__dict__)

    task= Task(id = int(ide),project_id = proj_id,
        objective = data["objective"], title = data["title"], start_date = parse_deadline(data["start"]),
         end_date = parse_deadline(data["end"]), worker_id = parse_worker_id(data["assigne"]), status = parse_status_task(data["status"]))

    append_context_task(context, task)

    return task




def create_task_name(ide:int, ide_project:int, name:str
    , assigne = DEFAULT_ID_LEADER, context = None):
    
    task= Task(id = int(ide),title = name,project_id = int(ide_project), #name = name, aprox_time = 1,
        objective = "SOME OBJ",start_date = datetime.datetime(2023, 3, 12),
         end_date = datetime.datetime(2025, 3, 12), worker_id = assigne, status = TaskStatus.NEW)
    
    append_context_task(context, task)

    return task

def create_task_assigned(ide:int, ide_project:int,  assigne = DEFAULT_ID_LEADER):
    
    task= Task(id = int(ide),project_id = int(ide_project), #name = name, aprox_time = 1,
        objective = "", title = "SOME TIMTLE"+str(ide),start_date = datetime.datetime(2023, 3, 12),
         end_date = datetime.datetime(2025, 3, 12), worker_id = assigne, status = TaskStatus.NEW)

    append_context_task(context, task)

    return task







def check_exist_repository_projects(context):
    if not hasattr(context, "repository"):
        context.projects_map ={}

        context.repository = create_projects_repository()

        if hasattr(context, "repository_workers"):
            context.repository.workers = context.repository_workers ## Reference to the repository!
        else:
            context.repository.workers = MockRepositoryWorkers()




def check_exist_repository_tasks(context):
    if not hasattr(context, "repository_tasks"):
        check_exist_repository_projects(context)

     
        context.tasks_map ={}
        context.repository_tasks = create_tasks_repository(context.repository)

        context.repository_tasks.workers = context.repository.workers ## Reference to the repository!



def check_exist_repository_workers(context):
    if not hasattr(context, "repository_workers"):

        if hasattr(context, "repository"):
            context.repository_workers = context.repository.workers  ## Reference to the workers already defined?!
        elif hasattr(context, "repository_tasks"):
            context.repository_workers = context.repository_tasks.workers  ## Reference to the workers already defined?!
        else:
            context.repository_workers = MockRepositoryWorkers()#[]




def assert_on_context_error(context, when, error):
    if(context.error == None):

        raise Exception("DID NOT RAISE ERROR at "+when+",  expected '"+str(error)+"'")

    if str(context.error) != str(error):
        raise Exception("At "+when+" expected '"+str(error)+"' got '"+str(context.error)+"'") from context.error




def assert_no_error(context, when):
    if(context.error != None):
        raise Exception("DID NOT Expect ERROR At "+when+" got '"+str(context.error)+"'") from context.error


async def assert_no_error_after(context, when, appended_action):
    if(context.error == None):
        try:
            await appended_action(context)
        except Exception as e:
            context.error = e

    assert_no_error(context, when)
