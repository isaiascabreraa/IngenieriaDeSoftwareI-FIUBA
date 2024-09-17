from utils import *
from behave import *
from res.projectHandler import project_handler

from models.project import Project, ProjectBase
from behave.api.async_step import async_run_until_complete
from res.projectHandler import ProjectHandler

@Then('the admin is notified that the project is closed')
def then_notifies_not_found(context):
    assert_on_context_error(context, "project update","Cannot update project when closed")






## UPDATE OF aprox time
@When('the leader modifies the aprox time for "{project_name}" to {aprox_time}h')
@async_run_until_complete
async def when_aprox_time_modified(context, project_name:str, aprox_time:int):

    handler = ProjectHandler(context.repository)

    project_id = parse_project_from_name(context, project_name)
    aprox_time = int(aprox_time)

    try:
        #print_info("ASSSING ACTION FOR ",project_id, "TO", leader_id,(await context.repository.get_project_by_id(project_id)).leader)
        first = await handler.get_project(project_id)
        first.aprox_time = aprox_time
        await handler.update_project(project_id, first)

        context.error = None

    except Exception as ex:
        context.error = ex


@Then('the aprox hours of the project "{project_name}" are changed to {proj_aprox}h')
@async_run_until_complete
async def then_modifies_aprox(context, project_name:str , proj_aprox: int):
    async def validate_result(ctx):
        ## validate
        project_id = parse_project_from_name(context, project_name)    
        res = await ctx.repository.get_project_by_id(project_id)

        assert res.aprox_time == int(proj_aprox)

    await assert_no_error_after(context, "update of aprox time", validate_result)

@Then('the admin is notified that the aprox time is invalid')
def then_notifies_invalid_aprox(context):
    assert_on_context_error(context, "project update aprox_time","Invalid time estimation")







### DEADLINE

@When('the leader modifies the deadline for "{project_name}" to "{new_deadline}"')
@async_run_until_complete
async def when_deadline_modified(context, project_name:str, new_deadline:str):

    handler = ProjectHandler(context.repository)

    project_id = parse_project_from_name(context, project_name)

    try:
        new_deadline = parse_deadline(new_deadline)
        first = await handler.get_project(project_id)
        first.deadline = new_deadline
        await handler.update_project(project_id, first)

        context.error = None

    except Exception as ex:
        context.error = ex


@Then('the deadline of the project "{project_name}" is changed to "{new_deadline}"')
@async_run_until_complete
async def then_modifies_aprox(context, project_name:str , new_deadline: str):
    async def validate_result(ctx):
        ## validate
        project_id = parse_project_from_name(context, project_name)    
        res = await ctx.repository.get_project_by_id(project_id)

        deadline = parse_deadline(new_deadline)

        assert res.deadline == deadline

    await assert_no_error_after(context, "update of deadline", validate_result)

@Then('the admin is notified that the deadline is invalid')
def then_notifies_invalid_aprox(context):
    assert_on_context_error(context, "project update deadline","Invalid deadline")



### STATUS






@When('the leader modifies the status for "{project_name}" to "{new_status}"')
@async_run_until_complete
async def when_status_modified(context, project_name:str, new_status:str):

    handler = ProjectHandler(context.repository)

    project_id = parse_project_from_name(context, project_name)

    try:
        new_status = parse_status(new_status)
        first = await handler.get_project(project_id)
        first.status = new_status
        await handler.update_project(project_id, first)

        context.error = None

    except Exception as ex:
        context.error = ex


@Then('the status of the project "{project_name}" is changed to "{new_status}"')
@async_run_until_complete
async def then_modifies_status(context, project_name:str , new_status: str):
    async def validate_result(ctx):
        ## validate
        project_id = parse_project_from_name(context, project_name)    
        res = await ctx.repository.get_project_by_id(project_id)

        status = parse_status(new_status)

        assert res.status == status

    await assert_no_error_after(context, "update of status", validate_result)

@Then('the admin is notified that the status is invalid')
def then_notifies_invalid_aprox(context):
    assert_on_context_error(context, "project update status","Invalid status")


