from utils import *
from behave import *

from behave.api.async_step import async_run_until_complete
from res.taskHandler import TaskHandler

@When('the user modifies the status for "{task_name}" on "{project_name}" to "{new_status}"')
@async_run_until_complete
async def when_modifies_status_task(context, task_name:str,project_name:str, new_status:str):
    handler = TaskHandler(context.repository_tasks)

    task_id = parse_task_from_title(context, task_name, project_name)
    project_id = parse_project_from_name(context, project_name)
    status = parse_status_task(new_status)

    try:

        first = await handler.get_task(task_id, project_id)
        first.status = status
        await handler.update_task(task_id, project_id, first)

        context.error = None
    except Exception as ex:
        context.error = ex


@Then('the status of the task "{task_name}" on "{project_name}" is changed to "{new_status}"')
@async_run_until_complete
async def then_modifies_status(context, task_name:str,project_name:str, new_status:str):
    async def validate_result(ctx):
        ## validate
        task_id = parse_task_from_title(context, task_name, project_name)
        project_id = parse_project_from_name(context, project_name)
        res = await ctx.repository_tasks.get_task_by_id(task_id, project_id)

        status = parse_status_task(new_status)
        assert res.status == status

    await assert_no_error_after(context, "task update status", validate_result)

@Then('the admin is notified that the status of task is invalid')
def then_notifies_invalid_aprox(context):
    assert_on_context_error(context, "task update status","Invalid status")


