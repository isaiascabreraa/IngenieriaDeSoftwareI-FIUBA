from utils import *
from behave import *
from res.projectHandler import project_handler

from models.project import Project, ProjectBase
from behave.api.async_step import async_run_until_complete
from res.projectHandler import ProjectHandler


### GENERAL CREATE GIVENS !! FOR PROJECTS
@Given('the projects')
def given_projects(context):
    check_exist_repository_projects(context)

    ide = 1
    for r in context.table:
        create_project_general(ide, r, context = context)
        ide +=1


@Given('a project "{project_id}" with name "{name}"')
def given_project_with_name(context, project_id:int, name:str):
    check_exist_repository_projects(context)
    create_project_name(project_id, name, context = context)



@Given('a project "{project_id}" with no leader')
def given_no_leader(context, project_id:int):
    check_exist_repository_projects(context)
    create_project_leader(project_id, context = context)
    print_info("-------------CREATED CONTEXT?!", context.repository)


@Given('a project "{project_id}" with leader "{leader_id}"')
def given_with_leader(context, project_id:int, leader_id:int):
    check_exist_repository_projects(context)
    create_project_leader(project_id, leader_id, context = context)

@Given('there is no projects')
def given_no_projects(context):
    check_exist_repository_projects(context)








### CREATION OF NEW
@When('the admin creates a project with name "{name}"')
@async_run_until_complete
async def when_create_proj_name(context, name:str):
    proj = create_project_name(4, name) ## SHULD NOT IMPOSE IT?!
    map_project_on(context, proj, original = False) ## So we can map it afterwards!

    handler = ProjectHandler(context.repository)

    try:
        await handler.create_project(proj)
        context.error = None
    except Exception as ex:
        context.error = ex


### THENS BASED ON PROJECT EXISTENCE
@Then('the project with name "{name}" is created')
@async_run_until_complete
async def then_a_project_with_name_is_created(context, name:str):
    assert_no_error(context, "project creation")
    
    context.result_project = await context.repository.get_project_by_id(parse_project_from_name(context, name, original = False))
    ## noted we look for a not originally added project!
    
    if context.result_project == None:
        raise Exception("Project was not created when it should!")
    print_info("NAME GIVEN ",name, "IS ",context.result_project.name)
    assert name == context.result_project.name


@Then('the admin is notified that the project already exists and duplicates are not allowed')
def then_notifies_duplicated(context):
    assert_on_context_error(context, "project creation ","Project already exists")

@Then('the admin is notified that the project does not exist')
def then_notifies_not_found(context):
    assert_on_context_error(context, "project obtain","Project not found")
