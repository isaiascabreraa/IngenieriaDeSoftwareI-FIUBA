
import { useEffect, useState } from "react";
import { Button, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { classNames, convertDateMMDDYYYYToDDMMYYYY, mapAllObjectsByID, parseAllDates } from "@/components/utils";
import { StatusLabel } from "@/components/projectGridRow";
import { backHost } from "@/types/types";

var project_id: any;

export default function ProjectId() {
    const router = useRouter()

    const [descriptionMore, setDescriptionMore] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const [project, setProject]: any[] = useState(undefined);


    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        project_id = router.query.project_id;
        project_id = +project_id;

        fetch(`${backHost.project}/projects/${project_id}`)
            .then((response) => {
                if (response.status === 500) {
                    setProject(undefined)
                    return;
                }

                return response.json()
            })
            .then((data) => {

                fetch(`${backHost.project}/workers/${data.leader}`)
                    .then(response => {
                        if (response.status === 500) {
                            setProject(undefined)
                            return;
                        }

                        return response.json()
                    })
                    .then(_worker => {
                        _worker = { id: _worker.id, name: (_worker.name + " " + _worker.last_name) };

                        data = mapAllObjectsByID([...[data]], "leader", [...[_worker]]).at(0);
                        data = parseAllDates([data], ["deadline"]).at(0)

                        setProject(data);
                    })
                    .catch(err => console.log(err))
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.isReady]);

    if (!project) {
        return (
            <div className="w-full h-full colors_background flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }

    const seeDescription = () => {
        setDescriptionMore(!descriptionMore);
    }

    const deleteProject = async () => {
        await fetch(`${backHost.project}/projects/${project_id}`, {
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
                        <DialogPanel className="max-w-lg space-y-6  border border-black rounded-lg bg-white p-8 colors_background">
                            <DialogTitle className="font-bold text-xl text-center mb-10">Delete project {project_id}</DialogTitle>
                            <Description className="font-semibold text-justify">Are you sure you want to delete the project?</Description>
                            <div className="w-full flex flex-row space-x-10">
                                <Button onClick={() => setShowDialog(false)} className="w-1/2 colors_button  h-8 rounded-md border border-black">CANCEL</Button>
                                <Button onClick={deleteProject} className="w-1/2 colors_button_alt  h-8 rounded-md border border-black">DELETE</Button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </>
        )
    }

    return (
        <div className="colors_background w-full h-full flex-col flex place-content-center items-center text-black">
            <ConfirmDeleteDialog />
            <div className="colors_header text-white w-6/12 rounded-t-lg pl-1 text-xl border-black border-t border-r border-l">Project details</div>
            <div className="colors_layout_background w-6/12 flex rounded-b-lg border-black border py-2 px-2">

                <div className="w-full items-center justify-start">
                    <div className="flex-col flex w-full">
                        <div className="flex-row flex w-full">
                            <label className="text-2xl px-1 w-full truncate">{project.id + " - "} {project.name}</label>
                            <div className="mr-4 place-self-center w-3/12">
                                {StatusLabel(project['status'])}
                            </div>
                        </div>
                        <div className="bg-slate-400 pb-2 mt-2 ml-4 mr-4 px-1 rounded-md border border-black">

                            <div className="flex-row mt-2.5">
                                <label>Estimated time:</label>
                                <label className="text-white"> {" " + project.aprox_time + " days"}</label>
                            </div>
                            <div className="flex-row mt-2.5">
                                <label> Deadline:</label>
                                <label className="text-white">{" " + convertDateMMDDYYYYToDDMMYYYY(project.deadline)}</label>
                            </div>
                            <div className="flex-row mt-2.5">
                                <label> Project leader: </label>
                                <label className="text-white"> {" " + (project.leader === undefined ? 'Waiting for assignment' : project.leader.name)}</label>
                            </div>
                        </div>

                        <div className={"bg-slate-400 mt-2 px-1 mx-4 rounded-md border border-black max-h-72" + classNames(descriptionMore ? " overflow-y-scroll" : "")}>
                            <label className="text-justify antialiased w-full ">{(descriptionMore ? project.objective : project.objective.slice(0, 1100)) + (project.objective.length > 1100 && !descriptionMore ? "..." : "")}</label>
                            {
                                project.objective.length > 1100 &&
                                <button className="ml-2 text-white underline" onClick={seeDescription}>{descriptionMore ? "show less" : "show more"}</button>
                            }
                        </div>

                        <div className="flex-row flex place-content-between px-4 space-x-10 py-3 w-full">
                            <Link className="w-4/12 colors_button flex justify-center h-10 rounded-md border border-black" href={{ pathname: `/projects/${project['id']}/tasks` }}>
                                <Button>
                                    See all tasks
                                </Button >
                            </Link >
                            <Link className="w-4/12 colors_button flex justify-center h-10 rounded-md border border-black" href={{ pathname: `/projects/${project['id']}/modify` }}>
                                <Button>
                                    Modify project
                                </Button>
                            </Link>
                            <Link className="w-4/12 colors_button flex justify-center h-10 rounded-md border border-black" href={{ pathname: `/projects/` }}>
                                <Button>
                                    Go back
                                </Button>
                            </Link>
                            <Button className="w-4/12 colors_button_alt h-10 rounded-md border border-black" onClick={() => setShowDialog(true)}>
                                Delete project
                            </Button>

                        </div >

                    </div >
                </div >
            </div >
        </div >
    )
}