from utils import *
from behave import *
from res.projectHandler import project_handler

from models.project import Project, ProjectBase
from behave.api.async_step import async_run_until_complete
from res.projectHandler import ProjectHandler


@When('the leader requests the project with name "{project_name}"')
@async_run_until_complete
async def when_project_request(context, project_name:str):
	handler = ProjectHandler(context.repository)

	project_id = parse_project_from_name(context, project_name)
	try:
		context.result = await handler.get_project(project_id)
		context.error = None

	except Exception as ex:
		context.result = None
		context.error = ex




## THENS
@Then('the project aprox time is {aprox_time}h')
@async_run_until_complete
async def then_aprox_time_is(context, aprox_time:int):
	async def validate(ctx):
		assert context.result.aprox_time == int(aprox_time)


	await assert_no_error_after(context, "request of aprox time", validate)


@Then('the project deadline is "{deadline}"')
@async_run_until_complete
async def then_deadline_is(context, deadline:str):
	async def validate(ctx):
		assert context.result.deadline == parse_deadline(deadline)

	await assert_no_error_after(context, "request of deadline", validate)




