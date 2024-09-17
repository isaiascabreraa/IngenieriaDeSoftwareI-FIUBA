import { useEffect, useState } from "react";
import ComboBox from "@/components/combobox";
import Table, { ITableItems, Tab } from "@/components/table";
import { Data, IComboBoxItems } from "@/components/types";
import TextBox from "@/components/textBox";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parseAllDates, mapAllObjectsByID } from "@/components/utils";
import Link from "next/link";
import { backHost } from "@/types/types";

const filters = {
    status: new Data({ id: -1, name: "All" }),
    leader: new Data({ id: -1, name: "" }),
    name: new Data("")
}

function filterListByStatus(status: number, deadline: string | undefined,
    leader: { id: number, name: string } | undefined, name: string
    ,
    list: any[]) {

    if (status !== -1 && status !== undefined) {
        list = list.filter(item => item.status === status);
    }

    if (deadline !== "" && deadline !== undefined) {
        list = list.filter(item => Date.parse(item.deadline) <= Date.parse(deadline));
    }

    if (leader?.id !== -1 && leader !== undefined) {
        leader.id === -2 ?
            list = list.filter(item => item.leader === undefined) :
            list = list.filter(item => item.leader?.id === leader.id)
    }

    if (name !== "" && name !== undefined) {
        list = list.filter(item => item.name.toLowerCase().search(name.toLowerCase()) !== -1)
    }

    return list;
}

export default function Projects() {

    const [list, setList]: any[] = useState(undefined);
    var [filtered_list, setFilteredList]: any[] = useState(undefined);
    const [selectedDate, setSelectedDate] = useState(undefined);
    const handleChange = (date: any) => { setSelectedDate(date) };
    const [workers, setWorkers]: any[] = useState(undefined)

    useEffect(() => {
        fetch(`${backHost.project}/projects`)
            .then((response) => {
                if (response.status === 500) {
                    setList([])
                    setFilteredList([])
                    setWorkers([])
                    return;
                }

                return response.json()
            })
            .then((data) => {

                fetch(`${backHost.project}/workers/`)
                    .then(response => {
                        if (response.status === 500) {
                            setList([])
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

                        data = mapAllObjectsByID(data, "leader", _workers);
                        data = parseAllDates(data, ["deadline"])
                        setList(data);
                        setFilteredList(data);
                        setWorkers(_workers);
                    })
                    .catch(err => console.log(err))
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    if (!list || !workers) {
        return (
            <div className="w-full h-full colors_background flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }

    let tbl_items: ITableItems = {
        headers: [{
            title: "ID",
            width: "px-6 + w-1/12"

        }, {
            title: "Name",
            width: "w-full"

        }, {
            title: "Leader",
            width: "w-7/12"

        }, {
            title: "Deadline",
            width: "w-4/12"
        }, {

            title: "Status",
            width: "w-4/12"

        }, {
            title: "Details",
            width: "w-4/12"

        }],
        row_type: "project",
        row_items: filtered_list,
        n_items_col: 10,
        new_tab: new Tab(),
        data: []
    }


    const name = {
        title: '',
        description: "Filter name",
        id: "name",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.name,
        default_value: undefined,
        style: { overflow: 'hidden' }
    }


    const leader_combo: IComboBoxItems = {
        combo_items: [{ id: -2, name: "Waiting for assignment" }, ...workers],
        data: filters.leader,
        default_value: { id: -1, name: "Filter leader" },
        def_option: { id: -1, name: "Filter leader" }
    }

    const status_combo: IComboBoxItems = {
        combo_items: [
            { id: 0, name: 'New' },
            { id: 1, name: 'In progress' },
            { id: 2, name: 'Finished' },
            { id: 3, name: 'Closed' }
        ],
        data: filters.status,
        default_value: undefined,
        def_option: { name: 'Filter status', id: -1 }
    }

    const applyFilters = () => {
        setFilteredList(filterListByStatus(
            filters.status.data?.id, selectedDate,
            filters.leader.data, filters.name.data, list
        ))
    }

    return (
        <div className="colors_background px-2 w-full h-full flex-col flex place-content-center items-center text-black">
            <div className='border border-black w-full rounded-md rounded-md shadow'>
                <div className='text-left pl-2 colors_header h-8 rounded-t-md text-xl text-white'>See all projects</div>
                <div className="w-full h-11/12">
                    <div className="w-full">
                        <div className="flex-row flex place-items-center justify-center px-6 py-2 mb-1.5">
                            <div className="flex-col flex w-full place-content-between space-y-2">
                                <div className="flex-row flex w-full justify-between place-items-center">

                                    <div className="w-6/12 h-8">
                                        <TextBox {...name}></TextBox>
                                    </div>
                                    <div className="flex-row flex w-3/12 place-items-center justify-center">

                                        <DatePicker
                                            showIcon
                                            selected={selectedDate}
                                            onChange={(date) => handleChange(date?.toDateString())}
                                            dateFormat="dd/MM/yyyy"
                                            wrapperClassName="w-10/12 h-8"
                                            className="w-full rounded-l-md border border-black text-left h-8"
                                            placeholderText="Filter max deadline"
                                        />
                                        <button className="colors_button_alt text-white w-2/12 h-8 rounded-tr-md rounded-br-md border-black border-r border-t border-b" onClick={() => setSelectedDate(undefined)}>Clear</button>
                                    </div>
                                    <button className="colors_button w-2/12 rounded-md border border-black h-8" onClick={applyFilters}> Apply filters</button>
                                </div>
                                <div className="flex-row flex w-full justify-between place-items-center">

                                    <div className="w-6/12 h-8">
                                        <ComboBox {...leader_combo} />

                                    </div>
                                    <div className="w-3/12 h-8">
                                        <ComboBox {...status_combo} />

                                    </div>
                                    <Link href="/projects/new" className="colors_button w-2/12 text-center py-0.5 text-black border border-black h-8 rounded-md">New project</Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full shadow">
                            <Table {...tbl_items}></Table>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
