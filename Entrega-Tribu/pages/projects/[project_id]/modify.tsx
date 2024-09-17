import ComboBox from "@/components/combobox";
import TextBox from "@/components/textBox";
import { IComboBoxItems, Data } from "@/components/types";
import { Button, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from "next/router";
import Link from "next/link";
import { convertDateToYYYYMMDD, mapAllObjectsByID, parseAllDates } from "@/components/utils";
import { backHost } from "@/types/types";


var validateName: boolean = false;
var validateObjective: boolean = false;
var validateEstimatedTime: boolean = false;
var validateStatus: boolean = false;

var selectedName: Data = new Data(undefined);
var selectedObjective: Data = new Data(undefined);
var selectedEstimatedTime: Data = new Data(undefined);
var selectedProjectLeader: Data = new Data(undefined);
var selectedStatus: Data = new Data(undefined);
var project_id: any;

function mapStatus(status: number) {
    switch (status) {
        case 0:
            return { id: 0, name: "New" }
        case 1:
            return { id: 1, name: "In progress" }
        case 2:
            return { id: 2, name: "Finished" }
        default:
            return { id: 3, name: "Closed" }
    }
}

export default function ModifyProject() {

    const router = useRouter()


    const [updateRender, setUpdateRender] = useState(false);

    const [selectedDate, setSelectedDate] = useState(undefined);
    const handleChange = (date: any) => setSelectedDate(date);
    const [project, setProject]: any = useState(undefined);

    const [showLoad, setShowLoad] = useState(false);

    const [showDialog, setShowDialog] = useState(false);
    const [workers, setWorkers]: any[] = useState(undefined);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        project_id = router.query.project_id;
        project_id = +project_id;

        fetch(`${backHost.project}/projects/${project_id}`)
            .then((response) => {
                if (response.status === 500) {
                    return;
                }

                return response.json()
            })
            .then((data) => {

                fetch(`${backHost.project}/workers/`)
                    .then(response => response.json())
                    .then(_workers => {
                        _workers = _workers.map((item: any) =>
                            item = { id: item.id, name: (item.name + " " + item.last_name) }
                        )

                        data = mapAllObjectsByID([...[data]], "leader", _workers).at(0);
                        data = parseAllDates([...[data]], ["deadline"]).at(0);

                        setWorkers(_workers);
                        handleChange(data.deadline);
                        selectedName.data = data.name;
                        selectedObjective.data = data.objective;
                        selectedEstimatedTime.data = data.aprox_time;
                        //selectedStatus.data = mapStatus(data.status);
                        setProject(data);
                    })
                    .catch(err => console.log(err))

            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.isReady]);


    if (!project || !workers) {
        return (
            <div className="w-full h-full colors_background flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }


    const name = {
        title: "Edit title*",
        description: "Title",
        id: "title",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedName,
        default_value: project.name,
        style: { overflow: 'hidden' }
    }

    const description = {
        title: "Edit description*",
        description: "Add the description here...",
        id: "description",
        className: "block border border-black whitespace-pre-line outline-none text-clip h-36 w-full text-nowrap resize-none rounded-md py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedObjective,
        default_value: project.objective,
        style: {}
    }

    const aprox_time = {
        title: "Edit estimated time*",
        description: "Estimated days to finish",
        id: "aprox_time",
        className: "block whitespace-nowrap w-6/12 outline-none text-clip h-8 text-nowrap resize-none rounded-md border border-black py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: selectedEstimatedTime,
        default_value: project.aprox_time.toString(),
        style: { overflow: 'hidden' }
    }


    const combobox_options: IComboBoxItems = {
        combo_items: [...workers],
        data: selectedProjectLeader,
        default_value: project.leader,
        def_option: { id: -1, name: "Choose an option" }
    }

    const status_combo: IComboBoxItems = {
        combo_items: [
            { id: 0, name: 'New' },
            { id: 1, name: 'In progress' },
            { id: 2, name: 'Finished' },
            { id: 3, name: 'Closed' }
        ],
        data: selectedStatus,
        default_value: mapStatus(project.status),
        def_option: { id: -1, name: "Choose an option" }
    }


    const valStatus = (status: number) => {
        if (status === -1) {
            return true;
        }

        switch (project.status) {
            case 0:
                return false;
            default:
                return status === 0 ? true : false;
        }
    }

    const validate = () => {
        validateName = (selectedName.data !== undefined) && (selectedName.data !== '') ? selectedName.data.length > 64 : true;
        validateObjective = (selectedObjective.data !== undefined) && (selectedObjective.data !== '') ? selectedObjective.data.length > 2048 : true;
        validateEstimatedTime = (selectedEstimatedTime.data !== undefined) && (selectedEstimatedTime.data !== '') ?
            (parseInt(selectedEstimatedTime.data, 10) <= 0) ||
            (isNaN(Number(selectedEstimatedTime.data.toString()))) ||
            (!Number.isInteger(+selectedEstimatedTime.data)) ||
            (+selectedEstimatedTime.data > Number.MAX_SAFE_INTEGER) ||
            (!Number.isFinite(+selectedEstimatedTime.data)) : true;
        validateStatus = selectedStatus.data !== undefined ? valStatus(selectedStatus.data.id) : true;
        setUpdateRender(!updateRender);
    }

    const submit = async () => {

        if (selectedDate === undefined) {
            //Checked before, just ignore
            return;
        }

        const data = selectedProjectLeader.data.id !== -1 ? {
            "name": selectedName.data,
            "objective": selectedObjective.data,
            "deadline": convertDateToYYYYMMDD(new Date(selectedDate)),
            "leader": selectedProjectLeader.data.id,
            "aprox_time": Number(selectedEstimatedTime.data),
            "status": selectedStatus.data.id
        } : {
            "name": selectedName.data,
            "objective": selectedObjective.data,
            "deadline": convertDateToYYYYMMDD(new Date(selectedDate)),
            "aprox_time": selectedEstimatedTime.data,
            "status": selectedStatus.data.id
        }

        await fetch(`${backHost.project}/projects/${project_id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .catch((err) => {
                console.log(err.message);
            })

        window.history.back();
    }

    const handleSubmit = () => {
        validate()

        if (validateStatus) {
            return;
        }

        if (validateObjective) {
            return;
        }

        if (validateEstimatedTime) {
            return;
        }

        if (validateName) {
            return;
        }

        setShowLoad(true);
        submit();
    }

    const goBack = () => {
        validateObjective = false;
        validateName = false;
        validateEstimatedTime = false;
        validateStatus = false;
    }

    const ConfirmGoBackDialog = () => {
        return (
            <>
                <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="relative z-50">
                    <div className="fixed text-black inset-0 flex w-screen items-center justify-center p-4">
                        <DialogPanel className="max-w-lg space-y-6  border border-black rounded-lg bg-white p-8 colors_background">
                            <DialogTitle className="font-bold text-xl text-center mb-10">Cancel project modification</DialogTitle>
                            <Description className="font-semibold text-justify">Are you sure you want to cancel the project modification?</Description>
                            <div className="w-full flex flex-row space-x-10">
                                <Button onClick={() => setShowDialog(false)} className="w-1/2 colors_button text-center align-middle h-8 rounded-md border border-black">STAY HERE</Button>
                                <Link className="w-1/2 colors_button_alt flex justify-center h-8 rounded-md border border-black" href={{ pathname: `/projects/${project_id}` }}>
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
        <div className="colors_background w-full h-full flex-col flex place-content-center items-center text-black">
            <ConfirmGoBackDialog />
            <div className="colors_header text-white w-5/12 rounded-t-lg pl-1 text-xl border-black border-t border-r border-l">Modify project - {project.id}</div>
            <div className="colors_layout_background w-5/12 flex-col flex px-4 py-3 justify-center rounded-b-lg border-black border">
                <div className="mb-2.5 w-full flex-row flex">
                    <div className="w-full">
                        <TextBox {...name}></TextBox>
                        {
                            validateName &&
                            <label className="text-red-600 font-semibold">Title length must be up to 64 characters</label>
                        }
                    </div>
                    <label className="text-xs w-full pb-2 text-amber-600 text-end">* means required field</label>
                </div>
                <div className="mb-2.5">
                    <TextBox {...description}></TextBox>
                    {
                        validateObjective &&
                        <label className="text-red-600 font-semibold">Description length must be up to 2048 characters</label>
                    }
                </div>
                <div className="mb-2.5">
                    <TextBox  {...aprox_time} ></TextBox>
                    <div className="flex-col flex w-full">
                        {
                            validateEstimatedTime &&
                            <label className="text-red-600 font-semibold">Estimated time must be a natural number</label>
                        }
                    </div>
                </div>
                <label className="text-xl font-medium pb-1 leading-6 text-gray-900 ">Edit deadline*</label>
                <div className="w-6/12 flex-row flex place-items-start">

                    <DatePicker
                        showIcon
                        selected={selectedDate}
                        onChange={(date) => handleChange(date?.toDateString())}
                        dateFormat="dd/MM/yyyy"
                        wrapperClassName="w-full"
                        className="w-full pl-2 pt-2 pr-2 align-middle rounded-l-md border border-black text-left h-8"
                        placeholderText="DD/MM/YYYY"
                    />
                    <button className="colors_button_alt text-white w-1/5 h-8 rounded-tr-md rounded-br-md border-black border-r border-t border-b" onClick={() => setSelectedDate(undefined)}>Clear</button>
                </div>

                <div className=" flex-col flex w-6/12 place-items-start">
                    <label className="text-xl font-medium whitespace-nowrap pb-1 pt-2 leading-6 text-gray-900">Edit status* </label>
                    <div className="w-full">
                        <ComboBox {...status_combo} />
                    </div>
                </div>
                {
                    validateStatus &&
                    <div className="flex-col flex">
                        <label className="text-red-600 font-semibold">You must select a valid status to change</label>
                        {
                            project.status.id > 0 &&
                            <label className="text-red-600 text-sm font-semibold">You can not go back to new state. </label>
                        }
                    </div>
                }

                <div className="flex-col flex justify-center w-6/12 place-items-start">
                    <label className="text-xl font-medium whitespace-nowrap pb-1 pt-2 leading-6 text-gray-900">Edit Assigned project leader </label>
                    <div className="w-full">
                        <ComboBox {...combobox_options} />
                    </div>
                </div>
                <div className="flex-row flex w-6/12 h-8 space-x-4 mt-2 place-self-end">
                    <Button onClick={handleSubmit} className="flex place-items-center justify-center w-full whitespace-nowrap px-1 colors_button h-full rounded border border-black ">
                        {showLoad ? <img className=" h-full" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." /> : "Submit modifications"}
                    </Button>
                    <Button onClick={() => setShowDialog(true)} className="w-full text-center align-middle colors_button_alt h-full rounded border border-black">Go back</Button>

                </div>

            </div>
        </div >
    )
}