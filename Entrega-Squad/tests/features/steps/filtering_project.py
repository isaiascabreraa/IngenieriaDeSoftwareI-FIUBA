from utils import *
from behave import *
from res.projectHandler import project_handler

from models.project import Project, ProjectBase
from behave.api.async_step import async_run_until_complete
from res.projectHandler import ProjectHandler



## Filter by state

@When('the leader filters by state "{status}"')
@async_run_until_complete
async def when_aprox_time_modified(context, status: str):
	handler = ProjectHandler(context.repository)
	try:
		context.showed_res= await handler.get_projects_by_status(parse_status(status))
		context.error = None
	except Exception as ex:
		context.showed_res = []
		context.error = ex


@Then('the systems shows the projects')
@async_run_until_complete
async def then_show_filtered(context):
	async def verify_existence(ctx):
		ide = -1
		res = list(context.showed_res)
		for r in context.table:
			ide = parse_project_from_name(context, r["name"])
			ind = res.index(create_project_general(ide, r))
			if(ind == -1):
				raise Exception("Did not show project "+str(ide)+" name: "+r["name"])
			
			res.pop(ind)

		print("::",res,len(res))
		assert 0 == len(res)
	
	await assert_no_error_after(context, "project filtering",verify_existence)

@Then('the systems notifies that there is no results')
def then_notifies_no_results(context):
    assert_on_context_error(context, "project filtering","No existing projects with given status")
