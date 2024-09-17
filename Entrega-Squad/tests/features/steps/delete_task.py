from utils import *
from behave import *

from behave.api.async_step import async_run_until_complete
from res.taskHandler import TaskHandler
#from models.task import Task, TaskBase


@When('the admin deletes a task with title "{title}" on project "{project_name}"')
@async_run_until_complete
async def when_delete_task_ide(context, title:str, project_name:str):
    #ide =  parse_project_from_name(context, project_name)
    ide =  parse_task_from_title(context, title,project_name)
    handler = TaskHandler(context.repository_tasks)
    project_id = parse_project_from_name(context, project_name)

    try:
        await handler.delete_task(ide,project_id)

        context.error = None
    except Exception as ex:
        context.error = ex

@Then('the task with title "{title}" is deleted from "{project_name}"')
@async_run_until_complete
async def then_a_task_with_name_is_delted(context, title:str, project_name:str):
    async def validate(ctx):
        project_id = parse_project_from_name(context, project_name)
        context.result_task = await context.repository_tasks.get_task_by_id(parse_task_from_title(context, title, project_name),project_id)
        if(context.result_task != None):
            raise Exception("Task was not deleted!")

    await assert_no_error_after(context, "task deletion",validate)


@Then('the admin is notified that the task does not exist on project')
def then_notifies_not_found(context):
    assert_on_context_error(context, "task delete","Task not found")
