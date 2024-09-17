from behave import *
from utils import *

from res.projectHandler import ProjectHandler

from behave.api.async_step import async_run_until_complete

from res.workerHandler import WorkerHandler


@Given('the existence of the worker "{worker_id}"')
def given_no_leader(context, worker_id:int):
    check_exist_repository_workers(context)
    context.repository_workers.append(int(worker_id))




@Given('the employees')
def given_employees(context):
    check_exist_repository_workers(context)

    for r in context.table:
        context.repository_workers.append(parse_worker(r["name"]))
        #print_info("SHOULD ADDD WORKER?!", r, context.repository_workers)

@Given('no employees')
def given_employees(context):
    check_exist_repository_workers(context)

@Given('the system is experiencing problems')
def given_employees(context):
    check_exist_repository_workers(context)

    context.repository_workers.set_is_working(False)

@Then('the admin is notified that the given employee does not exist')
def then_notify_leader_invalid_no_exist(context):
    assert_on_context_error(context, "employee set","The employee given does not exist")



@Then('the system notifies there is something wrong and to try it later')
def then_notify_external_system_error(context):
    assert_on_context_error(context, "employee request","There was an unexpected error while requesting, try later.")


@Then('the system notifies there is no employees')
def then_notify_external_system_error(context):
    assert_on_context_error(context, "employee request","There is no employees available")




@When('the user requests the employees')
@async_run_until_complete
async def when_request_employees(context):
    handler = WorkerHandler(context.repository_workers)

    try:
        #print_info("ASSSING ACTION FOR ",project_id, "TO", leader_id,(await context.repository.get_project_by_id(project_id)).leader)
        context.showed_res= await handler.get_workers()
        context.error = None
    except Exception as ex:
        context.showed_res = []
        context.error = ex


@Then('the system shows the employees')
@async_run_until_complete
async def then_show_filtered_tasks(context):
    async def verify_existence(ctx):
        ide = -1
        res = list(context.showed_res)
        for r in context.table:
            worker_parsed = parse_worker(r["name"])

            ind = res.index(worker_parsed)
            if(ind == -1):
                raise Exception("Did not show worker"+r["name"])
                #raise Exception("Did not show task "+str(ide)+" title: "+r["name"]+" on: "+r["worker_number"])

            res.pop(ind)

        assert 0 == len(res)
    
    await assert_no_error_after(context, "employee filtering",verify_existence)

