
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Link from "next/link";
import { IComboBoxItems, Data } from "@/components/types";
import ComboBox from "@/components/combobox";
import TextBox from "@/components/textBox";
import { backHost } from "@/types/types";
import { mapAllObjectsByID, parseAllDates } from "@/components/utils";

function mapSeverity(severity: number) {
    switch (severity) {
        case 0:
            return { id: 0, name: "S1" }
        case 1:
            return { id: 1, name: "S2" }
        case 2:
            return { id: 2, name: "S3" }
        default:
            return { id: 3, name: "S4" }
    }
}

function mapStatus(status: number) {
    switch (status) {
        case 0:
            return { name: 'New', id: 0 }
        case 1:
            return { name: 'In progress', id: 1 }
        case 2:
            return { name: 'Waiting client', id: 2 }
        case 3:
            return { name: 'Waiting development team', id: 3 }
        case 4:
            return { name: 'Fixed, waiting confirmation', id: 4 }
        case 5:
            return { name: 'Closed', id: 5 }
        default:
            return { name: 'Blocked', id: 6 }
    }
}

var validateDescription: boolean = false;
var validateSeverity: boolean = false;
var validateClient: boolean = false;
var validateAltDescription: boolean = false;
var validateTitle: boolean = false;
var validateEmployee: boolean = false;
var validateStatus: boolean = false;

var selectedDescription: Data = new Data(undefined);
var selectedClient: Data = new Data({ id: -1, name: "Choose an option" });
var selectedSeverity: Data = new Data({ id: -1, name: "Choose an option" });
var selectedAltDescription: Data = new Data(undefined);
var selectedTitle: Data = new Data(undefined);
var selectedEmployee: Data = new Data({ id: -1, name: "Choose an option" })
var selectedStatus: Data = new Data({ id: -1, name: "Choose an option" });

var product_id: any;
var version_id: any;
var ticket_id: any;

export default function ModifyTicket() {

    const router = useRouter()

    const [workers, setWorkers]: any[] = useState(undefined)
    const [clients, setClients]: any[] = useState(undefined)
    const [ticket, setTicket]: any[] = useState(undefined)
    const [updateRender, setUpdateRender] = useState(false)

    const [showDialog, setShowDialog] = useState(false);
    const [showLoad, setShowLoad] = useState(false)

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
                    setWorkers([])
                    setClients([])
                    return;
                }

                return response.json()
            })
            .then((data) => {
                fetch(`${backHost.project}/workers/`)
                    .then(response => {
                        if (response.status === 500) {
                            setTicket({})
                            setWorkers([])
                            setClients([])
                            return;
                        }

                        return response.json()
                    })
                    .then(_workers => {

                        fetch(`${backHost.support}/clients/`)
                            .then(response => {
                                if (response.status === 500) {
                                    setTicket({})
                                    setWorkers([])
                                    setClients([])
                                    return;
                                }

                                return response.json()
                            })
                            .then(_clients => {
                                _workers = _workers.map((item: any) =>
                                    item = { id: item.id, name: (item.name + " " + item.last_name) }
                                )

                                _clients = _clients.map((item: any) =>
                                    item = { ...item, name: item["razon social"] }
                                )

                                data = mapAllObjectsByID([...[data]], "employee_id", _workers).at(0);

                                data = mapAllObjectsByID([...[data]], "client_id", _clients).at(0);

                                data = parseAllDates([...[data]], ["opening_date", "closing_date"]).at(0)

                                selectedAltDescription.data = data.ticket_type === 0 ? data.response : data.playback_steps;
                                //selectedClient.data = data.client_id;
                                selectedDescription.data = data.description;
                                //selectedEmployee.data = data.employee_id;
                                //selectedSeverity.data = mapSeverity(data.severity);
                                selectedTitle.data = data.title;

                                setTicket(data);
                                setWorkers(_workers)
                                setClients(_clients)
                            })
                            .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.isReady])

    if (!ticket || !workers || !clients) {
        return (
            <div className="w-full h-full flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />;
            </div>
        )
    }

    const title = {
        title: "Edit title*",
        description: "title",
        id: "title",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedTitle,
        default_value: ticket["title"],
        style: { overflow: 'hidden' }
    }

    const description = {
        title: "Edit description*",
        description: "Description",
        id: "description",
        className: "text-clip h-36 w-full outline-none text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedDescription,
        default_value: ticket["description"],
        style: {}
    }

    const severity: IComboBoxItems = {
        combo_items: [
            { id: 1, name: 'S1' },
            { id: 2, name: 'S2' },
            { id: 3, name: 'S3' },
            { id: 4, name: 'S4' },
        ],
        data: selectedSeverity,
        default_value: mapSeverity(ticket.severity),
        def_option: { id: -1, name: "Choose an option" }
    }

    const status_combo: IComboBoxItems = {
        combo_items: [
            { name: 'New', id: 0 },
            { name: 'In progress', id: 1 },
            { name: 'Waiting client', id: 2 },
            { name: 'Waiting development team', id: 3 },
            { name: 'Fixed, waiting confirmation', id: 4 },
            { name: 'Closed', id: 5 },
            { name: 'Blocked', id: 6 },
        ],
        data: selectedStatus,
        default_value: mapStatus(ticket.status),
        def_option: { name: 'Filter status', id: -1 }
    }

    const response = {
        title: "Edit response*",
        description: " Comments regarding the response ",
        id: "response",
        className: "text-clip h-36 w-full outline-none text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedAltDescription,
        default_value: ticket.response,
        style: {}
    }

    const playback_steps = {
        title: "Edit playback steps*",
        description: "Playback steps",
        id: "playback_steps",
        className: "text-clip h-36 w-full outline-none text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedAltDescription,
        default_value: ticket.playback_steps,
        style: {}
    }

    const combobox_client: IComboBoxItems = {
        combo_items: [...clients],
        data: selectedClient,
        default_value: ticket.client_id,
        def_option: { id: -1, name: "Choose an option" }
    }

    const combobox_workers: IComboBoxItems = {
        combo_items: [...workers],
        data: selectedEmployee,
        default_value: ticket.employee_id,
        def_option: { id: -1, name: "Choose an option" }
    }

    const valStatus = (status: number) => {
        if (status === -1) {
            return true;
        }

        switch (ticket.status) {
            case 0:
                return false;
            default:
                return status === 0 ? true : false;
        }
    }

    const validate = () => {
        validateTitle = (selectedTitle.data !== undefined) && (selectedTitle.data !== '') ? selectedTitle.data.length > 64 : true;
        validateDescription = (selectedDescription.data !== undefined) && (selectedDescription.data !== '') ? selectedDescription.data.length > 2048 : true;
        validateClient = selectedClient.data !== undefined ? selectedClient.data.id === -1 : true;
        validateEmployee = selectedEmployee.data !== undefined ? selectedEmployee.data.id === -1 : true;

        validateAltDescription = (selectedAltDescription.data != undefined) && (selectedAltDescription.data !== '') ? selectedAltDescription.data.length > 2048 : true;

        if (ticket.ticket_type) {
            validateSeverity = selectedSeverity.data !== undefined ? selectedSeverity.data.id === -1 : true;
        }

        validateStatus = selectedStatus.data !== undefined ? valStatus(selectedStatus.data.id) : true;

        setUpdateRender(!updateRender);
    }

    const goBack = () => {
        validateDescription = false;
        validateSeverity = false;
        validateClient = false;
        validateAltDescription = false;
        validateTitle = false;
        validateEmployee = false;
        router.back();
    }

    const submit = async () => {

        const data = ticket.ticket_type ? {
            "title": selectedTitle.data,
            "description": selectedDescription.data,
            "client_id": selectedClient.data.id,
            "employee_id": selectedEmployee.data.id,
            "status": selectedStatus.data.id,
            "ticket_type": ticket.ticket_type,
            "product_id": product_id,
            "version_code": version_id,
            "severity_id": selectedSeverity.data.id,
            "playback_steps": selectedAltDescription.data,

        } : {
            "title": selectedTitle.data,
            "description": selectedDescription.data,
            "client_id": selectedClient.data.id,
            "employee_id": selectedEmployee.data.id,
            "status": selectedStatus.data.id,
            "ticket_type": ticket.ticket_type,
            "product_id": product_id,
            "version_code": version_id,
            "response": selectedAltDescription.data
        }

        await fetch(`${backHost.support}/tickets/${product_id}/${version_id}/${ticket_id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .catch((err) => {
                console.log(err.message);
            })


        router.back();
    }

    const handleSubmit = () => {
        validate();

        if (validateClient) {
            return;
        }

        if (validateEmployee) {
            return;
        }

        if (validateDescription) {
            return;
        }

        if (validateSeverity) {
            return;
        }

        if (validateTitle) {
            return;
        }

        if (validateAltDescription) {
            return;
        }

        setShowLoad(true);
        submit();
    }

    const ConfirmGoBackDialog = () => {
        return (
            <>
                <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="relative z-50">
                    <div className="fixed text-black inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-6  border border-black rounded-lg bg-white p-8 colors_layout_background_support">
                            <DialogTitle className="font-bold text-xl text-center mb-10">Cancel task creation</DialogTitle>
                            <Description className="font-semibold text-justify">Are you sure you want to cancel the creation of the task?</Description>
                            <div className="w-full flex flex-row space-x-10">
                                <Button onClick={() => setShowDialog(false)} className="w-1/2 colors_button_support text-center align-middle h-8 rounded-md border border-black">STAY HERE</Button>
                                <Link className="w-1/2 colors_button_alt flex justify-center h-8 rounded-md border border-black" href={{ pathname: `/products/${product_id}/versions/${version_id}/tickets/${ticket_id}` }}>
                                    <Button onClick={goBack}>
                                        GO BACK ANYWAY
                                    </Button>
                                </Link>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </>
        )
    }

    return (
        <div className="colors_background_support pt-2 pb-5 w-full h-full flex-col flex place-content-center items-center text-black">
            <ConfirmGoBackDialog />
            <div className="colors_header_support text-white w-5/12 rounded-t-lg pl-1 text-xl border-black border-t border-r border-l">Modify ticket</div>
            <div className="colors_screen w-5/12 flex-col flex px-4 py-3 justify-center rounded-b-lg border-black border">
                <div className="mb-2.5 w-full flex-row flex">
                    <div className="w-full">
                        <TextBox {...title}></TextBox>
                        {
                            validateTitle &&
                            <label className="text-red-600 font-semibold">Title length must be up to 64 characters</label>
                        }
                    </div>
                    <label className="text-xs w-full pb-2 text-amber-600 text-end">* means required field</label>
                </div>
                <div className="mb-2.5">
                    <TextBox {...description}></TextBox>
                    {
                        validateDescription &&
                        <label className="text-red-600 font-semibold">Description length must be up to 2048 characters</label>
                    }
                </div>

                <div className="flex-col flex justify-center w-6/12 place-items-start">

                    <label className="text-xl font-medium whitespace-nowrap pb-1  leading-6 text-gray-900">Modify client*</label>
                    <div className="w-full">
                        <ComboBox {...combobox_client}
                        />
                    </div>
                    {
                        validateClient &&
                        <label className="text-red-600 font-semibold">You must select a client</label>
                    }
                </div>
                <div className=" flex-col flex mb-2.5 justify-center w-6/12 place-items-start">
                    <label className="text-xl font-medium whitespace-nowrap pb-1 pt-2 leading-6 text-gray-900">Modify responsible employee* </label>
                    <div className="w-full">
                        <ComboBox {...combobox_workers} />
                    </div>
                    {
                        validateEmployee &&
                        <label className="text-red-600 font-semibold">You must select an employee</label>
                    }
                </div>
                <div className="flex-row w-6/12">
                    <label className="block text-xl font-medium pb-1 leading-6 text-gray-900">Edit status*</label>
                    <div className="mb-2.5 w-full">
                        <ComboBox {...status_combo} />
                    </div>
                    {
                        validateSeverity &&
                        <label className="text-red-600 font-semibold">You must select a status</label>
                    }
                </div>

                {
                    ticket.ticket_type === 1 &&
                    <div className="flex-col w-full">
                        <div className="flex-row w-6/12">
                            <label className="block text-xl font-medium pb-1 leading-6 text-gray-900">Edit severity*</label>
                            <div className="mb-2.5 w-full">
                                <ComboBox {...severity} />
                            </div>
                            {
                                validateSeverity &&
                                <label className="text-red-600 font-semibold">You must select a severity</label>
                            }
                        </div>
                        <div className="mb-2.5">
                            <TextBox {...playback_steps}></TextBox>
                            {
                                validateAltDescription &&
                                <label className="text-red-600 font-semibold">Playback steps length must be up to 2048 characters</label>
                            }
                        </div>
                    </div>
                }

                {
                    ticket.ticket_type === 0 &&
                    <div className="">
                        <TextBox {...response}></TextBox>
                        {
                            validateAltDescription &&
                            <label className="text-red-600 font-semibold">Playback steps length must be up to 2048 characters</label>
                        }
                    </div>
                }



                <div className="flex-row flex w-6/12 h-8 mt-2 space-x-4 place-self-end">

                    <Button onClick={handleSubmit} className="flex place-items-center justify-center w-full whitespace-nowrap px-1 colors_button_support h-full rounded border border-black ">
                        {showLoad ? <img className=" h-full" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." /> : "Submit modifications"}
                    </Button>

                    <Button onClick={() => setShowDialog(true)} className="w-full text-center align-middle colors_button_alt h-full rounded border border-black">Go back</Button>

                </div>
            </div>
        </div >
    )
}