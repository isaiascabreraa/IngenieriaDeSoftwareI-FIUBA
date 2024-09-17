from utils import *
from behave import *

from models.project import Project, ProjectBase
from behave.api.async_step import async_run_until_complete
from res.projectHandler import ProjectHandler



@When('the admin deletes the project with name "{project_name}"')
@async_run_until_complete
async def when_delete_project_name(context, project_name:str):
    ide =  parse_project_from_name(context,project_name)
    handler = ProjectHandler(context.repository)

    try:
        await handler.delete_project(ide)

        context.error = None
    except Exception as ex:
        context.error = ex

@Then('the project with name "{project_name}" is deleted')
@async_run_until_complete
async def then_a_project_with_name_is_deleted(context, project_name:str):
    async def validate(ctx):
        ide =  parse_project_from_name(context,project_name)

        context.result_project = await context.repository.get_project_by_id(ide)

        if(context.result_project != None):
            raise Exception("Project was not deleted!")


    await assert_no_error_after(context, "project deletion",validate)    
