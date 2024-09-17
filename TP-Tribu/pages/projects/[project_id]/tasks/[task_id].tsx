
import { useEffect, useState } from "react";
import { Button, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { classNames, mapAllObjectsByID, parseAllDates } from "@/components/utils";
import { StatusLabel, mapPriority } from "@/components/taskRow";
import { backHost } from "@/types/types";

var project_id: any;
var task_id: any;

export default function TaskId() {
    const router = useRouter()

    const [task, setTask]: any = useState(undefined);
    const [showDialog, setShowDialog] = useState(false);
    const [descriptionMore, setDescriptionMore] = useState(false);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        project_id = router.query.project_id;
        project_id = +project_id;

        task_id = router.query.task_id;
        task_id = +task_id;

        fetch(`${backHost.project}/tasks/${project_id}`)
            .then((response) => {
                if (response.status === 500) {
                    setTask({ id: -1 })
                    return;
                }

                return response.json()
            })
            .then((data) => {

                data = data.filter((item: any) => item.id === task_id).at(0);
                fetch(`${backHost.project}/workers/${data.worker_id}`)
                    .then(response => {
                        if (response.status === 500) {
                            setTask({ id: -1 })
                            return;
                        }

                        return response.json()
                    })
                    .then(_worker => {
                        _worker = { id: _worker?.id, name: (_worker?.name + " " + _worker?.last_name) }
                        data = mapAllObjectsByID([...[data]], "worker_id", [...[_worker]]).at(0);
                        data = parseAllDates([...[data]], ["start_date", "end_date"]).at(0);
                        setTask(data);
                    })
                    .catch(err => console.log(err))
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.isReady]);

    if (!task) {
        return (
            <div className="w-full h-full colors_background_task flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }


    const seeDescription = () => {
        setDescriptionMore(!descriptionMore);
    }

    const deleteTask = async () => {
        await fetch(`${backHost.project}/tasks/${project_id}/${task_id} `, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .catch((err) => {
                console.log(err.message);
            })

        window.history.back();
    }

    const ConfirmDeleteDialog = () => {
        return (
            <>
                <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="relative z-50">
                    <div className="fixed text-black inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-6  border border-black rounded-lg bg-white p-8 colors_layout_background_tasks">
                            <DialogTitle className="font-bold text-xl text-center mb-10">Delete task {task_id}</DialogTitle>
                            <Description className="font-semibold text-justify">Are you sure you want to delete the task?</Description>
                            <div className="w-full flex flex-row space-x-10">
                                <Button onClick={() => setShowDialog(false)} className="w-1/2 colors_button_tasks  h-8 rounded-md border border-black">CANCEL</Button>
                                <Button onClick={deleteTask} className="w-1/2 colors_button_alt  h-8 rounded-md border border-black">DELETE</Button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </>
        )
    }

    return (
        <div className="colors_background_task w-full h-full flex-col flex place-content-center items-center text-black">
            <ConfirmDeleteDialog />
            <div className="colors_header_task text-white w-6/12 rounded-t-lg pl-1 text-xl border-black border-t border-r border-l">Task details</div>
            <div className="colors_layout_background_tasks w-6/12 flex rounded-b-lg border-black border py-2 px-2">

                <div className="w-full items-center justify-start">
                    <div className="flex-col flex w-full">
                        <div className="flex-row flex w-full">
                            <label className="text-2xl px-1 w-full truncate">{task.id + " - "} {task.title}</label>
                            <div className="place-self-center w-2/12 mr-1">
                                {mapPriority(task['priority'])}
                            </div>
                            <div className="mr-4 place-self-center w-2/12">
                                {StatusLabel(task['status'])}
                            </div>
                        </div>
                        <div className="colors_screen_tasks flex-row flex pb-2 mt-2 ml-4 mr-4 px-1 rounded-md border border-black">
                            <div className="flex-col flex w-full">

                                <div className="flex-row mt-2.5 ">
                                    <label>Stardate:</label>
                                    <label className="text-white font-semibold"> {" " + task.start_date}</label>
                                </div>
                                <div className="flex-row mt-2.5">
                                    <label> Deadline:</label>
                                    <label className="text-white font-semibold">{" " + task.end_date}</label>
                                </div>
                            </div>
                            <div className="flex-col flex w-full">

                                <div className="flex-row mt-2.5 w-full">
                                    {
                                        task.worker_id === undefined ? (
                                            <label>Employee: </label>
                                        ) : (
                                            <label>Employee id:</label>
                                        )
                                    }
                                    <label className="text-white font-semibold">{" " + (task.worker_id === undefined ? 'Waiting for assignment' : task['worker_id']['id'])}</label>
                                </div>
                                {
                                    task.worker_id !== undefined &&
                                    <div className="flex-row ml-1.5 mt-2.5 whitespace-nowrap align-middle max-w-full text-ellipsis text-white overflow-hidden">
                                        <label className="text-black"> Name:</label>
                                        <label className="font-semibold">{" " + task['worker_id']['name']}</label>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className={"colors_screen_tasks mt-2 px-1 mx-4 rounded-md border border-black max-h-72" + classNames(descriptionMore ? " overflow-y-scroll" : "")}>
                            <label className="text-justify antialiased w-full ">{(descriptionMore ? task.objective : task.objective.slice(0, 1100)) + (task.objective.length > 1100 && !descriptionMore ? "..." : "")}</label>
                            {
                                task.objective.length > 1100 &&
                                <button className="ml-2 text-white font-semibold underline" onClick={seeDescription}>{descriptionMore ? "show less" : "show more"}</button>
                            }
                        </div>
                        <div className="flex-row flex place-content-between px-4 space-x-10 py-3 w-full">
                            <Button onClick={router.back} className="w-4/12 colors_button_tasks justify-center h-10 rounded-md border border-black">
                                Go back
                            </Button>
                            <Link className="w-4/12 colors_button_tasks flex justify-center h-10 rounded-md border border-black" href={{ pathname: `/projects/${task['project_id']}/tasks/${task['id']}/modify` }}>
                                <Button>
                                    Modify task
                                </Button>
                            </Link>
                            <Button className="w-4/12 text-center place-self-center align-middle colors_button_alt h-10 rounded-md border border-black" onClick={() => setShowDialog(true)}>
                                Delete task
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
