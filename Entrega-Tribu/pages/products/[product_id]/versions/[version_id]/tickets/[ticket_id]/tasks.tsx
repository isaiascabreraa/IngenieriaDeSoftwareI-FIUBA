import { useEffect, useState } from "react";
import Table, { ITableItems, Tab } from "@/components/table";
import { Data, IComboBoxItems } from "@/components/types";
import { mapAllObjectsByID, parseAllDates } from "@/components/utils";
import TextBox from "@/components/textBox";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ComboBox from "@/components/combobox";
import Link from "next/link";
import { Button, Checkbox, Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

import { backHost } from "@/types/types";
import { useRouter } from "next/router";
import { StatusLabel } from "@/components/projectGridRow";


const filters = {
    status: new Data({ id: -1, name: "All" }),
    priority: new Data({ id: -1, name: "All" }),
    worker: new Data({ id: -1, name: "" }),
    name: new Data(""),
    project: new Data({ id: -1, name: "All projects" }),
    task: new Data({ id: -1, name: "All tasks" })
}

function filterListByStatus(
    status: number, priority: number, deadline: string | undefined,
    startDate: string | undefined, name: string, employee: { id: number, name: string }
    , project: any, task: any, enabled_tasks: any[] | undefined,
    list: any[]) {

    if (status !== -1 && status !== undefined) {
        list = list.filter(item => item['status'] === status);
    }

    if (priority !== -1 && priority !== undefined) {
        list = list.filter(item => item['priority'] === priority);
    }

    if (project.id !== -1 && project !== undefined) {
        list = list.filter(item => item.project_id === project.id);
    }

    if (task.id !== -1 && enabled_tasks !== undefined) {
        task.id === 0 ?
            list = list.filter(item => {
                var index: number = -1;

                enabled_tasks?.forEach((element: any) => {
                    if ((element.data.id === item.id) && (element.data.project_id === item.project_id)) {
                        index = enabled_tasks?.indexOf(element);
                    }
                });

                return index === -1;
            }) :
            list = list.filter(item => {
                var index: number = -1;

                enabled_tasks?.forEach((element: any) => {
                    if ((element.data.id === item.id) && (element.data.project_id === item.project_id)) {
                        index = enabled_tasks?.indexOf(element);
                    }
                });

                return index !== -1;
            })
    }

    if (startDate !== "" && startDate !== undefined) {
        list = list.filter(item => Date.parse(item['start_date']) <= Date.parse(startDate));
    }

    if (deadline !== "" && deadline !== undefined) {
        list = list.filter(item => Date.parse(item['end_date']) <= Date.parse(deadline));
    }

    if (employee?.id !== -1 && employee !== undefined) {
        employee.id === -2 ?
            list = list.filter(item => item.worker_id === undefined) :
            list = list.filter(item => item.worker_id?.id === employee.id)
    }

    if (name !== "" && name !== undefined) {
        list = list.filter(item => item.title.toLowerCase().search(name.toLowerCase()) !== -1)
    }

    return list;
}

var product_id: any;
var version_id: any;
var ticket_id: any;

const Tasks = () => {

    const router = useRouter()
    const [showDialog, setShowDialog] = useState(false);

    const [tasks, setTasks]: any[] = useState(undefined);
    var [filtered_list, setFilteredList]: any[] = useState(undefined);

    const [startDate, setStartDate] = useState(undefined);
    const changeStartDate = (date: any) => { setStartDate(date) };

    const [deadline, setDeadline] = useState(undefined);
    const changeDeadline = (date: any) => { setDeadline(date) };

    const [projects, setProjects]: any[] = useState(undefined)
    const [workers, setWorkers]: any[] = useState(undefined)

    const [data, setData]: any[] = useState(undefined)

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        product_id = router.query.product_id;
        product_id = +product_id;

        version_id = router.query.version_id;

        ticket_id = router.query.ticket_id;
        ticket_id = +ticket_id;

        fetch(`${backHost.support}/tasks/${product_id}/${version_id}/${ticket_id}`)
            .then((response) => {
                if (response.status === 500) {
                    setData([])
                    return;
                }

                return response.json();
            })
            .then((_data) => {
                if (_data == undefined) {
                    return;
                }

                _data = _data.map((item: any) => {
                    item = new Data({ id: item.task_id, project_id: item.project_id });
                    return item;
                })

                setData(_data)
            })
            .catch((error) => {
                console.log(error)
            })

        fetch(`${backHost.project}/tasks`)
            .then((response) => {
                if (response.status === 500) {
                    setTasks([])
                    setWorkers([])
                    setFilteredList([])
                    setProjects([])
                    return;
                }

                return response.json()
            })
            .then((data) => {
                fetch(`${backHost.project}/workers`)
                    .then((response) => {
                        if (response.status === 500) {
                            setTasks([])
                            setWorkers([])
                            setFilteredList([])
                            setProjects([])
                            return;
                        }

                        return response.json()
                    })
                    .then((_workers) => {
                        _workers = _workers.map((item: any) =>
                            item = { id: item.id, name: (item.name + " " + item.last_name) }
                        )

                        data = mapAllObjectsByID([...data], "worker_id", _workers);
                        data = parseAllDates([...data], ["start_date", "end_date"]);

                        const _projects: any[] = []
                        data.forEach((task: any) => {
                            _projects.push({
                                id: task.project_id, name: <label className="flex-row flex w-full">{<div className="w-32">{StatusLabel(task.project_status)}</div>} {task.project_title}</label>, status: task.project_status
                            })
                        })

                        const ids = new Set<any>();
                        setProjects(_projects.filter(({ id }) => !ids.has(id) && ids.add(id)))

                        setWorkers(_workers);
                        setTasks(data);
                        setFilteredList(data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })

    }, [router.isReady]);

    if (!tasks || !workers || !projects || !data) {
        return (
            <div className="w-full h-full flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }

    let tbl_items: ITableItems = {
        headers: [{
            title: "ID",
            width: "px-6 + w-1/12"

        }, {
            title: "Title",
            width: "w-full"

        }, {
            title: "Project",
            width: "w-7/12"

        }, {
            title: "Employee",
            width: "w-7/12"

        }, {
            title: "Stardate",
            width: "w-4/12"
        }, {

            title: "Deadline",
            width: "w-4/12"

        }, {
            title: "Status",
            width: "w-4/12"

        }, {
            title: "Priority",
            width: "w-3/12 pl-2"

        }, {
            title: "Assigned",
            width: "w-3/12"
        }, {
            title: "Details",
            width: "w-4/12"
        }],
        row_type: "ticket_task",
        row_items: filtered_list,
        n_items_col: 8,
        new_tab: undefined,
        data: data
    }

    const name = {
        title: '',
        description: "Filter title",
        id: "title",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.name,
        default_value: undefined,
        style: { overflow: 'hidden' }
    }

    const priority_combo: IComboBoxItems = {
        combo_items: [
            { name: 'Low', id: 0 },
            { name: 'Moderate', id: 1 },
            { name: 'High', id: 2 },
        ],
        data: filters.priority,
        default_value: undefined,
        def_option: { name: 'Filter priority', id: -1 }
    }

    const projects_combo: IComboBoxItems = {
        combo_items: [...projects],
        data: filters.project,
        default_value: undefined,
        def_option: { name: 'All projects with tasks', id: -1 }
    }

    const tasks_combo: IComboBoxItems = {
        combo_items: [
            { name: 'All tasks', id: -1 },
            { name: 'No assigned tasks', id: 0 },
            { name: 'Assigned tasks', id: 1 },
        ],
        data: filters.task,
        default_value: undefined,
        def_option: { name: 'All tasks', id: -1 }
    }

    const status_combo: IComboBoxItems = {
        combo_items: [
            { name: 'New', id: 0 },
            { name: 'In progress', id: 1 },
            { name: "Finished", id: 2 },
            { name: 'Closed', id: 3 },
            { name: 'Blocked', id: 4 },
        ],
        data: filters.status,
        default_value: undefined,
        def_option: { name: 'Filter status', id: -1 }
    }

    const workers_combo: IComboBoxItems = {
        combo_items: [{ id: -2, name: "Waiting for assignment" }, ...workers],
        data: filters.worker,
        default_value: { id: -1, name: "Filter employee" },
        def_option: { id: -1, name: "Filter employee" }
    }

    const applyFilters = () => {
        setFilteredList(filterListByStatus(
            filters.status.data?.id, filters.priority.data?.id, deadline,
            startDate, filters.name.data, filters.worker.data,
            filters.project.data, filters.task.data, data, tasks
        ))
    }

    const submit = async () => {

        const _data: any[] = [];

        data.forEach((item: any) => _data.push({ task_id: item.data.id, project_id: item.data.project_id }))

        await fetch(`${backHost.support}/tasks/${product_id}/${version_id}/${ticket_id}`, {
            method: 'PUT',
            body: JSON.stringify(_data),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                response.json()
            })
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
                        <DialogPanel className="max-w-lg space-y-6  border border-black rounded-lg bg-white p-8 colors_layout_background_tasks">
                            <DialogTitle className="font-bold text-xl text-center mb-10">Cancel association of tasks to the ticket</DialogTitle>
                            <Description className="font-semibold text-justify">Are you sure you want to cancel the association of tasks to the ticket?</Description>
                            <div className="w-full flex flex-row space-x-10">
                                <Button onClick={() => setShowDialog(false)} className="w-1/2 colors_button_tasks text-center align-middle h-8 rounded-md border border-black">STAY HERE</Button>
                                <Button onClick={router.back} className="w-1/2 colors_button_alt flex justify-center h-8 rounded-md border border-black">
                                    GO BACK ANYWAY
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>
            </>
        )
    }

    return (
        <div className="colors_background_task px-2 w-full h-full flex-col flex place-content-center items-center text-black">
            <ConfirmGoBackDialog />
            <div className='m-5 w-full place-content-end flex flex-col'>
                <div className='colors_header_task text-left pl-2 colors_header h-8 border-t border-l border-r border-black rounded-t-md text-xl text-white'>See all tasks</div>
                <div className="colors_background_task w-full border border-black rounded-b-md ">
                    <div className="flex-row flex place-items-center justify-center px-6 py-2 mb-1.5">
                        <div className="flex-col flex w-full place-content-between space-y-2">
                            <div className="flex-row flex w-full space-x-10">
                                <div className="flex-col flex w-7/12">

                                    <div className="w-full h-8 mr-8">
                                        <TextBox {...name}></TextBox>
                                    </div>
                                    <div className="flex-row flex w-full space-x-10 mt-2">

                                        <div className="flex-row flex w-4/12 place-items-center justify-center">

                                            <DatePicker
                                                showIcon
                                                selected={startDate}
                                                onChange={(date) => changeStartDate(date?.toDateString())}
                                                dateFormat="dd/MM/yyyy"
                                                wrapperClassName="w-full h-8"
                                                className="w-full rounded-l-md border border-black text-left h-8"
                                                placeholderText="Filter max start date"
                                            />
                                            <button className="colors_button_alt text-white w-2/12 h-8 rounded-tr-md rounded-br-md border-black border-r border-t border-b" onClick={() => changeStartDate(undefined)}>Clear</button>
                                        </div>
                                        <div className="flex-row flex w-4/12 place-items-center justify-center">

                                            <DatePicker
                                                showIcon
                                                selected={deadline}
                                                onChange={(date) => changeDeadline(date?.toDateString())}
                                                dateFormat="dd/MM/yyyy"
                                                wrapperClassName="w-full h-8"
                                                className="w-full rounded-l-md border border-black text-left h-8"
                                                placeholderText="Filter max deadline"
                                            />
                                            <button className="colors_button_alt text-white w-2/12 h-8 rounded-tr-md rounded-br-md border-black border-r border-t border-b" onClick={() => changeDeadline(undefined)}>Clear</button>
                                        </div>
                                        <div className="w-4/12 h-8">
                                            <ComboBox {...workers_combo} />

                                        </div>
                                    </div>
                                </div>
                                <div className="flex-col flex w-5/12">
                                    <div className="flex-row flex w-full space-x-10">

                                        <div className="w-7/12 h-8">
                                            <ComboBox {...status_combo} />

                                        </div>
                                        <button className="colors_button_tasks w-5/12 rounded-md border border-black h-8" onClick={applyFilters}> Apply filters</button>
                                    </div>
                                    <div className="flex-row flex w-full space-x-10 mt-2">

                                        <div className="w-7/12 h-8">
                                            <ComboBox {...priority_combo} />

                                        </div>
                                        {
                                            filters.project.data?.id !== -1 && filters.project.data?.status < 3 ? (
                                                <a href={`/projects/${filters.project.data.id}/tasks/new`} className="colors_button_tasks w-5/12 text-center py-0.5 text-black border border-black h-8 rounded-md">New task for selected project</a>
                                            ) : (
                                                <div className="w-5/12"></div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex-row flex place-content-center">
                                {

                                    <div className="w-full flex-row flex space-x-10">
                                        <div className="w-7/12">
                                            <ComboBox {...projects_combo} />
                                        </div>
                                        <div className="w-5/12 flex-row flex space-x-10">
                                            <div className="w-7/12">
                                                <ComboBox {...tasks_combo} />
                                            </div>
                                            <button className="colors_button_tasks w-5/12 rounded-md border border-black h-8" onClick={submit}> Save tasks</button>
                                        </div>

                                    </div>

                                }
                            </div>
                        </div>
                    </div>
                    <div className="w-full shadow">
                        <Table {...tbl_items}></Table>
                    </div>
                </div>
                <Button onClick={() => setShowDialog(true)} className="place-self-end justify-center text-center mt-2 bg-red-400 h-10 w-20 colors_button_alt text-center text-black border border-black rounded-md">
                    Go back
                </Button>
            </div>
        </div >
    )

};

export default Tasks;
