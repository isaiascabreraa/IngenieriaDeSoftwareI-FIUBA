import { Button, Description, Dialog, DialogPanel, DialogTitle, Field, Label, Switch } from "@headlessui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IComboBoxItems, Data } from "@/components/types";
import ComboBox from "@/components/combobox";
import TextBox from "@/components/textBox";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { backHost } from "@/types/types";

var validateDescription: boolean = false;
var validateSeverity: boolean = false;
var validateClient: boolean = false;
var validatePaybackSteps: boolean = false;
var validateTitle: boolean = false;
var validateEmployee: boolean = false;

var selectedDescription: Data = new Data(undefined);
var selectedClient: Data = new Data({ id: -1, name: "Choose an option" });
var selectedSeverity: Data = new Data({ id: -1, name: "Choose an option" });
var selectedPaybacksteps: Data = new Data(undefined);
var selectedTitle: Data = new Data(undefined);
var selectedEmployee: Data = new Data({ id: -1, name: "Choose an option" })

var product_id: any;
var version_id: any;

export default function NewTicket() {

    const router = useRouter()

    const [workers, setWorkers]: any[] = useState(undefined)
    const [clients, setClients]: any[] = useState(undefined)
    const [updateRender, setUpdateRender] = useState(false)

    const [showDialog, setShowDialog] = useState(false);
    const [isIncident, setIsIncident] = useState(false);
    const [showLoad, setShowLoad] = useState(false)

    useEffect(() => {

        if (!router.isReady) {
            return;
        }

        product_id = router.query.product_id;
        product_id = +product_id;

        version_id = router.query.version_id;

        fetch(`${backHost.project}/workers`)
            .then((response) => {
                if (response.status === 500) {
                    setWorkers([])
                    return;
                }

                return response.json()
            })
            .then((_workers) => {
                _workers = _workers.map((item: any) =>
                    item = { id: item.id, name: (item.name + " " + item.last_name) }
                )

                setWorkers(_workers)
            })
            .catch((error) => {
                console.log(error)
            })

        fetch(`${backHost.support}/clients`)
            .then((response) => {
                if (response.status === 500) {
                    setClients([])
                    return;
                }

                return response.json()
            })
            .then((_clients) => {
                _clients = _clients.map((item: any) =>
                    item = { ...item, name: item["razon social"] }
                )
                setClients(_clients)
            })
            .catch((error) => {
                console.log(error)
            })

    }, [router.isReady])

    if (!workers || !clients) {
        return (
            <div className="w-full colors_background_support h-full flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }

    const title = {
        title: "Add a title*",
        description: "Title",
        id: "title",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedTitle,
        default_value: '',
        style: { overflow: 'hidden' }
    }

    const description = {
        title: "Add a Description*",
        description: "Description",
        id: "description",
        className: "text-clip h-36 w-full outline-none text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedDescription,
        default_value: "",
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
        default_value: { id: -1, name: "Choose an option" },
        def_option: { id: -1, name: "Choose an option" }
    }

    const playback_steps = {
        title: "Add playback steps*",
        description: "Playback steps",
        id: "playback_steps",
        className: " text-clip h-36 w-full outline-none text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedPaybacksteps,
        default_value: "",
        style: {}
    }

    const combobox_client: IComboBoxItems = {
        combo_items: [...clients],
        data: selectedClient,
        default_value: { id: -1, name: "Choose an option" },
        def_option: { id: -1, name: "Choose an option" }
    }

    const combobox_workers: IComboBoxItems = {
        combo_items: [...workers],
        data: selectedEmployee,
        default_value: { id: -1, name: "Choose an option" },
        def_option: { id: -1, name: "Choose an option" }
    }

    const validate = () => {
        validateTitle = (selectedTitle.data !== undefined) && (selectedTitle.data !== '') ? selectedTitle.data.length > 64 : true;
        validateDescription = (selectedDescription.data !== undefined) && (selectedDescription.data !== '') ? selectedDescription.data.length > 2048 : true;
        validateClient = selectedClient.data !== undefined ? selectedClient.data.id === -1 : true;
        validateEmployee = selectedEmployee.data !== undefined ? selectedEmployee.data.id === -1 : true;

        if (isIncident) {
            validateSeverity = selectedSeverity.data !== undefined ? selectedSeverity.data.id === -1 : true;
            validatePaybackSteps = (selectedPaybacksteps.data !== undefined) && (selectedPaybacksteps.data !== '') ? selectedPaybacksteps.data.length > 2048 : true;
        }

        setUpdateRender(!updateRender);
    }

    const goBack = () => {
        validateDescription = false;
        validateSeverity = false;
        validateClient = false;
        validatePaybackSteps = false;
        validateTitle = false;
        validateEmployee = false;
        router.back();
    }

    const submit = async () => {

        const data = isIncident ? {
            "title": selectedTitle.data,
            "description": selectedDescription.data,
            "client_id": selectedClient.data.id,
            "employee_id": selectedEmployee.data.id,
            "status": 0,
            "ticket_type": isIncident,
            "product_id": product_id,
            "version_code": version_id,
            "severity_id": selectedSeverity.data.id,
            "playback_steps": selectedPaybacksteps.data,
        } : {
            "title": selectedTitle.data,
            "description": selectedDescription.data,
            "client_id": selectedClient.data.id,
            "employee_id": selectedEmployee.data.id,
            "status": 0,
            "ticket_type": isIncident,
            "product_id": product_id,
            "version_code": version_id,

        }

        await fetch(`${backHost.support}/tickets/`, {
            method: 'POST',
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

    const ConfirmGoBackDialog = () => {
        return (
            <>
                <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="relative z-50">
                    <div className="fixed text-black inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-6  border border-black rounded-lg bg-white p-8 colors_layout_background_support">
                            <DialogTitle className="font-bold text-xl text-center mb-10">Cancel ticket creation</DialogTitle>
                            <Description className="font-semibold text-justify">Are you sure you want to cancel the creation of the ticket?</Description>
                            <div className="w-full flex flex-row space-x-10">
                                <Button onClick={() => setShowDialog(false)} className="w-1/2 colors_button_support text-center align-middle h-8 rounded-md border border-black">STAY HERE</Button>
                                <Link className="w-1/2 colors_button_alt flex justify-center h-8 rounded-md border border-black" href={{ pathname: `/products/${product_id}/versions/${version_id}/tickets/` }}>
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

    const switchTicket = () => {
        setIsIncident(!isIncident)
        selectedSeverity.data = { id: -1, name: "Choose an option" }
        selectedPaybacksteps.data = undefined
        validatePaybackSteps = false;
        validateSeverity = false;
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

        if (validatePaybackSteps) {
            return;
        }

        setShowLoad(true);
        submit();
    }

    return (
        <div className="colors_background_support w-full h-full flex-col flex place-content-center items-center text-black">
            <ConfirmGoBackDialog />
            <div className="colors_header_support text-white w-5/12 rounded-t-lg pl-1 text-xl border-black border-t border-r border-l">Create ticket</div>
            <div className="colors_layout_background_support w-5/12 flex-col flex px-4 py-3 justify-center rounded-b-lg border-black border">
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
                <div className="flex-col flex">
                    <label className="text-xl font-medium pb-1 leading-6 text-gray-900 ">Select ticket type*</label>
                    <div className="flex-row flex place-items-center space-x-4">
                        <label className="pb-1 font-bold">Query</label>
                        <Switch
                            checked={isIncident}
                            onChange={switchTicket}
                            className={`${isIncident ? 'colors_status_closed' : 'colors_status_in_progress'} shadow relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                        >
                            <span className="sr-only text-black">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`${isIncident ? 'translate-x-6' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                            />
                        </Switch>
                        <label className="pb-1  font-bold">Incident</label>
                    </div>
                </div>
                <div className="flex-col flex justify-center w-6/12 place-items-start">

                    <label className="text-xl font-medium whitespace-nowrap pb-1  pt-2 leading-6 text-gray-900">Select client*</label>
                    <div className="w-full">
                        <ComboBox {...combobox_client}
                        />
                    </div>
                    {
                        validateClient &&
                        <label className="text-red-600 font-semibold">You must select a client</label>
                    }
                </div>
                <div className=" flex-col flex justify-center w-6/12 place-items-start">
                    <label className="text-xl font-medium whitespace-nowrap pb-1 pt-2 leading-6 text-gray-900">Select a responsible employee* </label>
                    <div className="w-full">
                        <ComboBox {...combobox_workers} />
                    </div>
                    {
                        validateEmployee &&
                        <label className="text-red-600 font-semibold">You must select an employee</label>
                    }
                </div>

                {
                    isIncident &&
                    <div className="flex-col w-6/12">
                        <div className="flex-row mt-2.5">
                            <label className="block text-xl pb-1 font-medium leading-6 text-gray-900">Select severity*</label>
                            <div className="w-full">
                                <ComboBox {...severity} />
                            </div>
                        </div>
                        {
                            validateSeverity &&
                            <label className="text-red-600 font-semibold">You must select a severity</label>
                        }
                    </div>
                }
                {
                    isIncident &&
                    <div className="mb-2.5 mt-2">
                        <TextBox {...playback_steps}></TextBox>
                        {
                            validatePaybackSteps &&
                            <label className="text-red-600 font-semibold">Playback steps length must be up to 2048 characters</label>
                        }
                    </div>
                }


                <div className="flex-row flex w-6/12 h-8 mt-2 space-x-4 place-self-end">

                    <Button onClick={handleSubmit} className="flex place-items-center justify-center w-full colors_button_support h-full rounded border border-black ">
                        {showLoad ? <img className=" h-full" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." /> : "Submit new ticket"}
                    </Button>

                    <Button onClick={() => setShowDialog(true)} className="w-full text-center align-middle colors_button_alt h-full rounded border border-black">Go back</Button>

                </div>

            </div>
        </div >
    )
}