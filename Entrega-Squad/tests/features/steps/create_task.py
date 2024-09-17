from utils import *
from behave import *

from behave.api.async_step import async_run_until_complete
from res.taskHandler import TaskHandler
#from models.task import Task, TaskBase

### GENERAL CREATE GIVENS !! FOR TASKS
@Given('the tasks')
def given_tasks(context):
    check_exist_repository_tasks(context)

    ide = 1
    for r in context.table:
        create_task_general(ide,parse_project_from_name(context, r["project"]), r, context = context)
        ide +=1

@Given('a task "{task_id}" with title "{name}" on "{project_id}"')
def given_task_with_name(context, task_id:int, name:str, project_id:int):
    check_exist_repository_tasks(context)

    create_task_name(task_id,project_id, name, context = context)

@given('there is no tasks')
def given_no_tasks(context):
    check_exist_repository_tasks(context)










### WHENS
@When('the admin creates a task with title "{title}" on "{project_name}"')
@async_run_until_complete
async def when_create_task_name(context, title:str, project_name: str):
    project_id = parse_project_from_name(context, project_name)
    task = create_task_name(4, project_id, title) ## SHULD NOT IMPOSE IT?!

    map_task_on(context, task) ## So we can index it after!

    handler = TaskHandler(context.repository_tasks)

    try:
        await handler.create_task(task)
        context.error = None
    except Exception as ex:
        context.error = ex

@Then('the task with title  "{title}" is created on "{project_name}"')
@async_run_until_complete
async def then_a_task_with_name_is_created(context, title:str, project_name:str):
    async def validate(ctx):
        project_id = parse_project_from_name(context, project_name)
        context.result_task = await context.repository_tasks.get_task_by_id(parse_task_from_title(context, title,project_name),project_id)

        if context.result_task == None:
            raise Exception("Task was not created when it should!")
        assert title == context.result_task.title
        assert parse_project_from_name(context, project_name) == context.result_task.project_id

    await assert_no_error_after(context, "task creation",validate)



@Then('the admin is notified that the task already exists on the project and duplicates are not allowed')
def then_notifies_duplicated(context):
    assert_on_context_error(context, "task creation ","Task already exists on project")



@Then('the admin is notified that the task does not exist')
def then_notifies_not_found(context):
    assert_on_context_error(context, "task obtain","Task not found")
