import { useEffect, useState } from "react";
import Table, { ITableItems, Tab } from "@/components/table";
import { Data, IComboBoxItems } from "@/components/types";
import { mapAllObjectsByID, parseAllDates } from "@/components/utils";
import TextBox from "@/components/textBox";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ComboBox from "@/components/combobox";
import Link from "next/link";
import { Button } from "@headlessui/react";

import { backHost } from "@/types/types";
import { useRouter } from "next/router";


const filters = {
    status: new Data({ id: -1, name: "All" }),
    priority: new Data({ id: -1, name: "All" }),
    worker: new Data({ id: -1, name: "" }),
    name: new Data("")
}

function filterListByStatus(
    status: number, priority: number, deadline: string | undefined,
    startDate: string | undefined, name: string, employee: { id: number, name: string }
    ,
    list: any[]) {

    if (status !== -1 && status !== undefined) {
        list = list.filter(item => item['status'] === status);
    }

    if (priority !== -1 && priority !== undefined) {
        list = list.filter(item => item['priority'] === priority);
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

var project_id: any;

const Tasks = () => {

    const router = useRouter()

    const [tasks, setTasks]: any[] = useState(undefined);
    var [filtered_list, setFilteredList]: any[] = useState(undefined);
    const [project, setProject]: any = useState(undefined)

    const [startDate, setStartDate] = useState(undefined);
    const changeStartDate = (date: any) => { setStartDate(date) };

    const [deadline, setDeadline] = useState(undefined);
    const changeDeadline = (date: any) => { setDeadline(date) };

    const [workers, setWorkers]: any[] = useState(undefined)

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        project_id = router.query.project_id;
        project_id = +project_id;

        fetch(`${backHost.project}/tasks/${project_id}`)
            .then((response) => {
                if (response.status === 500) {
                    setTasks([]);
                    setFilteredList([]);
                    setWorkers([])
                    return;
                }

                return response.json();
            })
            .then((data) => {
                fetch(`${backHost.project}/workers/`)
                    .then(response => {
                        if (response.status === 500) {
                            setTasks([])
                            setFilteredList([])
                            setWorkers([])
                            return;
                        }

                        return response.json()
                    })
                    .then(_workers => {
                        _workers = _workers.map((item: any) =>
                            item = { id: item.id, name: (item.name + " " + item.last_name) }
                        )

                        data = mapAllObjectsByID([...data], "worker_id".toString(), [..._workers]);
                        data = parseAllDates(data, ['start_date', "end_date"]);

                        setTasks(data);
                        setFilteredList(data);
                        setWorkers(_workers);
                    })
                    .catch((err) => {
                        console.log(err)
                    });
            })
            .catch((err) => {
                console.log(err);
            });

        fetch(`${backHost.project}/projects/${project_id}`)
            .then((response) => {
                if (response.status === 500) {
                    return;
                }

                return response.json()
            })
            .then((data) => {
                setProject(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.isReady]);


    if (!tasks || !project || !workers) {
        return (
            <div className="w-full h-full colors_background_task flex place-content-center">
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
            title: "Employee",
            width: "w-7/12"

        }, {
            title: "Start date",
            width: "w-4/12"
        }, {

            title: "Deadline",
            width: "w-4/12"

        }, {
            title: "Status",
            width: "w-4/12"

        }, {
            title: "Priority",
            width: "w-2/12 pl-2"

        }, {
            title: "Details",
            width: "w-4/12"
        }],
        row_type: "task",
        row_items: filtered_list,
        n_items_col: 9,
        new_tab: new Tab(),
        data: []
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
            startDate, filters.name.data, filters.worker.data, tasks
        ))
    }

    return (
        <div className="colors_background_task px-2 w-screen h-full flex-col flex place-content-center items-center text-black">
            <div className='m-5 w-full place-content-end flex flex-col'>
                <div className="flex-row flex space-x-2 text-left align-middle pl-2 colors_header_task h-8 border-t border-l border-r border-black rounded-t-md text-xl max-w-full truncate text-white">
                    <div>{"See all tasks for project: "}</div>
                    <label className="w-full truncate">{project.name}</label>
                </div>
                <div className="h-11/12 w-full border border-black rounded-b-md ">
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
                                            project["status"] < 3 ? (
                                                <a href="tasks/new" className="colors_button_tasks w-5/12 text-center py-0.5 text-black border border-black h-8 rounded-md">New task</a>
                                            ) : (
                                                <div className="w-5/12"></div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full shadow">
                        <Table {...tbl_items}></Table>
                    </div>
                </div>
                <Link className="place-self-end flex justify-center text-center mt-2 bg-red-400 h-10 w-20 colors_button_tasks text-center text-black border border-black rounded-md" href={{ pathname: `/projects/${project_id}` }}>
                    <Button>
                        Go back
                    </Button>
                </Link>
            </div>
        </div >
    )

};

export default Tasks;
