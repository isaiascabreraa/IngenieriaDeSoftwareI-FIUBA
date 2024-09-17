
import { useEffect, useState } from "react";
import { Button, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { classNames, convertDateMMDDYYYYToDDMMYYYY, mapAllObjectsByID, parseAllDates } from "@/components/utils";
import { StatusLabel, mapResponseTime, mapSeverity } from "@/components/incidentGridRow";
import { backHost } from "@/types/types";

var product_id: any;
var version_id: any;
var ticket_id: any;

export default function ProjectId() {
    const router = useRouter()

    const [descriptionMore, setDescriptionMore] = useState(false);
    const [altMore, setAltMore] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [ticket, setTicket]: any[] = useState(undefined)

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        product_id = router.query.product_id;
        product_id = +product_id;

        version_id = router.query.version_id;

        ticket_id = router.query.ticket_id;
        ticket_id = +ticket_id;

        fetch(`${backHost.support}/tickets/${product_id}/${version_id}/${ticket_id}`)
            .then((response) => {
                if (response.status === 500) {
                    setTicket({})
                    return;
                }

                return response.json()
            })
            .then((data) => {
                fetch(`${backHost.project}/workers/${data.employee_id}`)
                    .then(response => {
                        if (response.status === 500) {
                            setTicket({})
                            return;
                        }

                        return response.json()
                    })
                    .then(_worker => {

                        fetch(`${backHost.support}/clients/${data.client_id}`)
                            .then(response => {
                                if (response.status === 500) {
                                    setTicket({})
                                    return;
                                }

                                return response.json()
                            })
                            .then(_client => {
                                _worker = { id: _worker.id, name: (_worker.name + " " + _worker.last_name) };

                                data = mapAllObjectsByID([...[data]], "employee_id", [...[_worker]]).at(0);

                                data = mapAllObjectsByID([...[data]], "client_id", [...[_client]]).at(0);

                                data = parseAllDates([data], ["opening_date", "closing_date"]).at(0)

                                setTicket(data);
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.isReady]);

    if (!ticket) {
        return (
            <div className="w-full h-full colors_background_support flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }

    const alt_title: string = ticket.ticket_type === 0 ? "Response:" : "Playback steps:"
    const alt_description: string = ticket.ticket_type === 0 ? ticket['response'] : ticket["playback_steps"];

    const seeDescription = () => {
        setDescriptionMore(!descriptionMore);
    }

    const seeAlt = () => {
        setAltMore(!altMore);
    }

    const deleteTicket = async () => {
        await fetch(`${backHost.support}/tickets/${product_id}/${version_id}/${ticket_id}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .catch((err) => {
                console.log(err.message);
            })
        router.back();
    }

    const ConfirmDeleteDialog = () => {
        return (
            <>
                <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="relative z-50">
                    <div className="fixed text-black inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-6 border border-black rounded-lg bg-white p-8 colors_layout_background_support">
                            <DialogTitle className="font-bold text-xl text-center mb-10">Delete ticket {ticket_id}</DialogTitle>
                            <Description className="font-semibold text-justify">Are you sure you want to delete the ticket?</Description>
                            <div className="w-full flex flex-row space-x-10">
                                <Button onClick={() => setShowDialog(false)} className="w-1/2 colors_button_support  h-8 rounded-md border border-black">CANCEL</Button>
                                <Button onClick={deleteTicket} className="w-1/2 colors_button_alt  h-8 rounded-md border border-black">DELETE</Button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </>
        )
    }


    return (
        <div className="colors_background_support w-full h-full flex-col flex place-content-center items-center text-black">
            <ConfirmDeleteDialog />
            <div className="colors_header_support text-white w-8/12 rounded-t-lg pl-1 text-xl border-black border-t border-r border-l">Ticket details</div>
            <div className="colors_screen w-8/12 flex rounded-b-lg border-black border py-2 px-2">

                <div className=" colors_screen w-full items-center justify-start">
                    <div className="colors_screen flex-col flex w-full">

                        <div className="colors_screen flex-row flex w-full">
                            <label className="text-2xl px-1 w-full truncate">{ticket.id + " - "} {ticket.title}</label>
                            <div className="mr-4 place-self-center w-4/12">
                                {StatusLabel(ticket['status'])}
                            </div>
                        </div>
                        <div className="colors_screen_light flex-row flex space-x-1 bg-slate-400 max-w-full pb-2 mt-2 ml-4 mr-4 px-1 rounded-md border border-black">
                            <div className="flex-col flex w-4/12">
                                <div className="flex-row mt-2.5">
                                    <label> Opening date: </label>
                                    <label className="text-white font-semibold"> {" " + convertDateMMDDYYYYToDDMMYYYY(ticket.opening_date)}</label>
                                </div>
                                <div className="flex-row mt-2.5">
                                    <label> Closing date:</label>
                                    <label className="text-white font-semibold">{" " + (ticket["closing_date"] != undefined ? convertDateMMDDYYYYToDDMMYYYY(ticket["closing_date"]) : "WIP")}</label>
                                </div>
                                {
                                    ticket.ticket_type === 1 &&
                                    <div className="flex-row mt-2.5">
                                        <label>Duration:</label>
                                        <label className="text-white font-semibold"> {" " + (ticket["duration"] != null ? ticket.duration + " days" : "WIP")}</label>
                                    </div>
                                }
                            </div>
                            <div className="colors_screen_light flex-col flex w-5/12">
                                <div className="flex-row mt-2.5 w-full">
                                    <label>Client id:</label>
                                    <label className="text-white font-semibold">{" " + ticket['client_id']['id']}</label>
                                </div>
                                <div className="flex-row ml-1.5 mt-2.5 whitespace-nowrap align-middle max-w-full text-ellipsis text-white overflow-hidden">
                                    <label className="text-black"> Business name:</label>
                                    <label className="font-semibold">{" " + ticket['client_id']['razon social']}</label>
                                </div>
                                <div className="flex-row ml-1.5 mt-2.5 w-full">
                                    <label> CUIT: </label>
                                    <label className="text-white font-semibold"> {" " + ticket['client_id']['CUIT']}</label>
                                </div>
                            </div>
                            <div className="colors_screen_light flex-col flex w-5/12">
                                <div className="flex-row mt-2.5 w-full">
                                    <label>Employee id:</label>
                                    <label className="text-white font-semibold">{" " + ticket['employee_id']['id']}</label>
                                </div>
                                <div className="flex-row ml-1.5 mt-2.5 whitespace-nowrap align-middle max-w-full text-ellipsis text-white overflow-hidden">
                                    <label className="text-black"> Name: </label>
                                    <label className="font-semibold">{" " + ticket['employee_id']['name']}</label>
                                </div>
                            </div>

                            {
                                ticket.ticket_type === 1 &&
                                <div className="colors_screen_light flex-col flex w-3/12">
                                    <div className="flex-row mt-2.5">
                                        <label>Severity:</label>
                                        <label className="text-white font-semibold"> {" " + mapSeverity(ticket["severity_id"])}</label>
                                    </div>
                                    <div className="flex-row mt-2.5">
                                        <label> Response time: </label>
                                        <label className="text-white font-semibold"> {" " + mapResponseTime(ticket["severity_id"])}</label>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={"flex-col flex mt-1"}>
                            <label className="mx-4 text-xl">Description:</label>
                            <div className={"colors_screen_light bg-slate-400 mt-0.5 px-1 mx-4 rounded-md border border-black max-h-48" + classNames(descriptionMore ? " overflow-y-scroll" : "")}>
                                <label className="text-justify antialiased max-h-48 w-full ">{(descriptionMore ? ticket.description : ticket.description.slice(0, 768)) + (ticket.description.length > 768 && !descriptionMore ? "..." : "")}</label>
                                {
                                    ticket.description.length > 768 &&
                                    <button className="ml-2 text-white font-semibold underline" onClick={seeDescription}>{descriptionMore ? "show less" : "show more"}</button>
                                }
                            </div>
                        </div>
                        {
                            alt_description != undefined &&

                            <div className={"flex-col flex mt-1"}>
                                <label className="mx-4 text-xl">{alt_title}</label>
                                <div className={"colors_screen_light bg-slate-400 mt-0.5 px-1 mx-4 rounded-md border border-black max-h-48" + classNames(altMore ? " overflow-y-scroll" : "")}>
                                    <label className="text-justify antialiased max-h-48 w-full ">{(altMore ? alt_description : alt_description.slice(0, 768)) + (alt_description.length > 768 && !altMore ? "..." : "")}</label>
                                    {
                                        alt_description.length > 768 &&
                                        <button className="ml-2 text-white font-semibold underline" onClick={seeAlt}>{altMore ? "show less" : "show more"}</button>
                                    }
                                </div>
                            </div>
                        }

                        <div className="flex-row flex place-content-between px-4 space-x-10 py-3 w-full">
                            <Link className="w-4/12 colors_button_support flex justify-center h-10 rounded-md border border-black" href={{ pathname: `/${router.asPath}/tasks` }}>
                                <Button>
                                    Associate tasks
                                </Button>
                            </Link>
                            <Link className="w-4/12 colors_button_support flex justify-center h-10 rounded-md border border-black" href={{ pathname: `/${router.asPath}/modify` }}>
                                <Button>
                                    Modify ticket
                                </Button>
                            </Link>
                            <Button onClick={router.back} className="w-4/12 colors_button_support justify-center h-10 rounded-md border border-black">
                                Go back
                            </Button>
                            <Button onClick={() => setShowDialog(true)} className="w-4/12 colors_button_alt  justify-center h-10 rounded-md border border-black">
                                Delete ticket
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}