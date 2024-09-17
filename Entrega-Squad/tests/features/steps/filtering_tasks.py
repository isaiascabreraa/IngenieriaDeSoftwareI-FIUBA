from utils import *
from behave import *

from behave.api.async_step import async_run_until_complete
from res.taskHandler import TaskHandler

@When('the leader requests the tasks from the project "{project_name}"')
@async_run_until_complete
async def when_request_project_tasks(context, project_name:str):

    handler = TaskHandler(context.repository_tasks)

    project_id = parse_project_from_name(context, project_name)

    try:
        context.showed_res= await handler.get_project_tasks(project_id)
        context.error = None

    except Exception as ex:
        context.showed_res = []
        context.error = ex


@Then('the systems shows the tasks')
@async_run_until_complete
async def then_show_filtered_tasks(context):
    async def verify_existence(ctx):
        ide = -1
        res = list(context.showed_res)
        for r in context.table:
            ide = parse_task_from_title(context, r["title"], r["project"])
            project_id = parse_project_from_name(context, r["project"])

            ind = res.index(create_task_general(ide,project_id, r))
            if(ind == -1):
                raise Exception("Did not show task "+str(ide)+" title: "+r["title"]+" on: "+r["project"])
            
            res.pop(ind)

        assert 0 == len(res)
    
    await assert_no_error_after(context, "task filtering",verify_existence)


@Then('the admin is notified that the project has no tasks')
def then_notifies_not_found_tasks(context):
    assert_on_context_error(context, "task filtering","No existing tasks for this project")
