from behave import *
from utils import *

from res.projectHandler import ProjectHandler

from behave.api.async_step import async_run_until_complete


@When('the admin assigns "{leader}" as the leader of "{project_name}"')
@async_run_until_complete
async def when_assigns_leader_to(context,leader:str, project_name:str):

    handler = ProjectHandler(context.repository)

    project_id = parse_project_from_name(context, project_name)
    leader_id = parse_worker_id(leader)

    try:
        first = await handler.get_project(project_id)
        first.leader = leader_id

        await handler.update_project(project_id, first)

        context.result_project = await context.repository.get_project_by_id(project_id)
        context.error = None

    except Exception as ex:
        context.result_project = None
        context.error = ex


@Then('the leader of "{project_name}" is changed to "{leader}"')
def then_assign_leader_to(context, leader:str, project_name:str):
    assert_no_error(context, "set leader")

    leader_id = parse_worker_id(leader)

    assert context.result_project.leader == int(leader_id)


@Then('the admin is notified that the project already has a leader')
def then_notify_already_has_leader(context):
    assert_on_context_error(context, "leader set","Leader is already assigned")
