from utils import *
from behave import *

from behave.api.async_step import async_run_until_complete
from res.taskHandler import TaskHandler

@When('the leader assigns "{worker}" as the assigne of "{task_name}" on "{project_name}"')
@async_run_until_complete
async def when_assigns_worker_to_task(context,worker:str, task_name:str,project_name:str):
    handler = TaskHandler(context.repository_tasks)

    task_id = parse_task_from_title(context, task_name, project_name)
    worker_id = parse_worker_id(worker)
    project_id = parse_project_from_name(context, project_name)

    try:
        #print_info("ASSSING ACTION FOR ",project_id, "TO", leader_id,(await context.repository.get_project_by_id(project_id)).leader)

        #print_info("WROKER?!", context.repository_workers, worker_id)
        first = await handler.get_task(task_id, project_id)
        first.worker_id = worker_id
        await handler.update_task(task_id,project_id, first)

        context.error = None
    except Exception as ex:
        context.error = ex


@Then('"{worker}" is added as the assignee of "{task_name}" on "{project_name}"')
@async_run_until_complete
async def then_assign_worker_to_task(context, worker:str, task_name:str,project_name:str):
    async def validate(ctx):
        #print_info("MAPPED IS ",worker_id, "GIVENS ", context.repository_workers, ctx.repository_workers)

        task_id = parse_task_from_title(context, task_name, project_name)
        project_id = parse_project_from_name(context, project_name)

        worker_id = parse_worker_id(worker)
        task = await context.repository_tasks.get_task_by_id(task_id,project_id)

        assert task.worker_id == int(worker_id)

    #print_info("WROKER THEN?!", context.repository_workers)

    await assert_no_error_after(context, "set assignee", validate)

    #print_info("WROKER THENAFR?!", context.repository_workers)
