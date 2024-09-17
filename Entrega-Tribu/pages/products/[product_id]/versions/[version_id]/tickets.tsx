import { useEffect, useState } from "react";
import ComboBox from "@/components/combobox";
import Table, { ITableItems, Tab } from "@/components/table";
import { Data, IComboBoxItems } from "@/components/types";
import TextBox from "@/components/textBox";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button, Disclosure } from "@headlessui/react";
import { classNames, mapAllObjectsByID, parseAllDates } from "@/components/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { backHost } from "@/types/types";

var filters = {
    title: new Data(""),
    status: new Data({ id: -1, name: "All" }),
    severity: new Data({ id: -1, name: "All" }),
    impact: new Data(''),
    duration: new Data(''),
    response_time: new Data({ id: -1, name: "All" }),
    client_cuit: new Data(''),
}

const getHeaders = (type: number) => {
    var h: any[] = [
        { title: "ID", width: "px-6 w-1/12" },
        { title: "Client CUIT", width: "w-3/12" },
        { title: "Title", width: "w-full" },
        { title: "Status", width: "w-5/12" },
        { title: "Opening date", width: "w-3/12" },
        { title: "Closing date", width: "w-3/12" },
    ]

    if (type === 1) {
        h.push({ title: "Severity", width: "w-2/12" });
        h.push({ title: "Duration", width: "w-2/12" });
        h.push({ title: "Response time", width: "w-3/12 " });
    }

    h.push({ title: "Details", width: "w-3/12" })

    return h;
}

const getRow = (type: number) => {
    var row = "query"

    if (type === 1) {
        row = "incident";
    }

    return row;
}

function filterList(
    type: number, client_cuit: string, title: string, status: number, opening_date: string | undefined,
    closing_date: string | undefined, severity: number,
    duration: string, response_time: number, list: any[]
) {
    if (type !== -1 && type !== undefined) {
        list = list.filter(item => item['ticket_type'] === type);
    }

    if (client_cuit !== "" && client_cuit !== undefined) {
        list = list.filter(item => item['client_id']['CUIT'].search(client_cuit) !== -1)
    }

    if (title !== "" && title !== undefined) {
        list = list.filter(item => item['title'].toLowerCase().search(title.toLowerCase()) !== -1)
    }

    if (status !== -1 && status !== undefined) {
        list = list.filter(item => item['status'] === status);
    }

    if (opening_date !== "" && opening_date !== undefined) {
        list = list.filter(item => Date.parse(item['opening_date']) <= Date.parse(opening_date));
    }

    if (closing_date !== "" && closing_date !== undefined) {
        list = list.filter(item => Date.parse(item['closing_date']) <= Date.parse(closing_date));
    }

    if (severity !== -1 && severity !== undefined) {
        list = list.filter(item => item['severity'] === severity);
    }

    if (duration !== '' && duration !== undefined) {
        list = list.filter(item => item['duration'] === Number(duration));
    }

    if (response_time !== -1 && response_time !== undefined) {
        list = list.filter(item => item['response_time'] === response_time);
    }

    return list;
}

const navigation = [
    { name: 'Query', current: true, type: 0 },
    { name: 'Incident', current: false, type: 1 },
]

var product_id: any;
var version_id: any;

export default function Tickets() {

    const router = useRouter();

    const [openingDate, setOpeningDate] = useState(undefined);
    const changeOpeningDate = (date: any) => { setOpeningDate(date) };

    const [closingDate, setClosingDate] = useState(undefined);
    const changeClosingDate = (date: any) => { setClosingDate(date) };
    const [headers, setHeaders] = useState(getHeaders(0));
    const [row, setRow] = useState(getRow(0));
    const [actual_type, setActualType] = useState(0);

    const [tickets, setTickets]: any[] = useState(undefined)
    var [filtered_list, setFilteredList]: any[] = useState(undefined);
    const [clients, setClients]: any[] = useState(undefined)

    const applyFilters = (type: number) => {
        setFilteredList(filterList(
            type, filters.client_cuit.data,
            filters.title.data, filters.status.data?.id,
            openingDate, closingDate, filters.severity.data?.id,
            filters.duration.data,
            filters.response_time.data?.id,
            tickets
        ))
    }

    useEffect(() => {

        if (!router.isReady) {
            return;
        }

        product_id = router.query.product_id;
        product_id = +product_id;

        version_id = router.query.version_id;

        fetch(`${backHost.support}/tickets/${product_id}/${version_id}`)
            .then((response) => {
                if (response.status === 500) {
                    setTickets([])
                    setFilteredList([])
                    setClients([])
                    return;
                }

                return response.json()
            })
            .then((data) => {
                fetch(`${backHost.support}/clients`)
                    .then((response) => {
                        if (response.status === 500) {
                            setTickets([])
                            setFilteredList([])
                            setClients([])
                            return;
                        }

                        return response.json()
                    })
                    .then((_clients) => {
                        _clients = _clients.map((_client: any) => { return { ..._client, name: _client["razon social"] } })

                        data = mapAllObjectsByID([...data], "client_id", _clients);
                        data = parseAllDates([...data], ["opening_date", "closing_date"]);
                        setTickets(data);
                        setFilteredList(filterList(
                            0, '', '', -1, undefined, undefined, -1,
                            '', -1, data
                        ))
                        setClients(_clients)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }, [router.isReady])

    if (!tickets || !clients) {
        return (
            <div className="w-full h-full colors_background_support flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }

    let tbl_items: ITableItems = {
        headers: headers,
        row_type: row,
        row_items: filtered_list,
        n_items_col: 9,
        new_tab: new Tab(),
        data: []
    }

    const title_text = {
        title: '',
        description: "Filter title",
        id: "title",
        className: "whitespace-nowrap text-clip h-8 mb-2 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.title,
        default_value: undefined,
        style: { overflow: 'hidden' }
    }

    const client_cuit_text = {
        title: '',
        description: "Filter client CUIT",
        id: "client_cuit",
        className: "whitespace-nowrap text-clip h-8 mb-2 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.client_cuit,
        default_value: undefined,
        style: { overflow: 'hidden' }
    }

    const impact_text = {
        title: '',
        description: "Filter impact",
        id: "impact",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.impact,
        default_value: undefined,
        style: { overflow: 'hidden' }
    }

    const duration_text = {
        title: '',
        description: "Filter duration",
        id: "duration",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.duration,
        default_value: undefined,
        style: { overflow: 'hidden' }
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
        data: filters.status,
        default_value: undefined,
        def_option: { name: 'Filter status', id: -1 }
    }

    const severity_combo: IComboBoxItems = {
        combo_items: [
            { name: 'S1', id: 0 },
            { name: 'S2', id: 1 },
            { name: 'S3', id: 2 },
            { name: 'S4', id: 3 }
        ],
        data: filters.severity,
        default_value: undefined,
        def_option: { name: 'Filter severity', id: -1 }
    }

    const response_time_combo: IComboBoxItems = {
        combo_items: [
            { name: '14 days', id: 0 },
            { name: '30 days', id: 1 },
            { name: '90 days', id: 2 },
            { name: '365 days', id: 3 }
        ],
        data: filters.status,
        default_value: undefined,
        def_option: { name: 'Filter response time', id: -1 }
    }


    const clearFilters = () => {
        filters = {
            title: new Data(""),
            status: new Data({ id: -1, name: "All" }),
            severity: new Data({ id: -1, name: "All" }),
            impact: new Data(''),
            duration: new Data(''),
            response_time: new Data({ id: -1, name: "All" }),
            client_cuit: new Data('')
        }

        setOpeningDate(undefined);
        setClosingDate(undefined);
    }

    const tabChange = (item: any) => {
        setHeaders(getHeaders(item.type));
        setRow(getRow(item.type))
        setActualType(item.type);
        navigation.map((item) => (item.current = false));
        item.current = true;
        tbl_items.new_tab?.set();
        clearFilters();
        applyFilters(item.type);
    }

    return (
        <div className="colors_background_support px-2 w-full h-full flex-col flex place-content-center items-center text-black">
            <div className='m-5 w-full place-content-end flex flex-col'>
                <div className='text-left pl-2 colors_header_support h-8 border-t border-l border-r border-black rounded-t-md text-xl text-white'>See all tickets</div>
                <div className="colors_screen h-11/12 w-full border border-black rounded-b-md ">
                    <Disclosure as="nav" className="colors_altern_support w-full">
                        {({ open }) => (
                            <>
                                <div className="mx-auto px-8">
                                    <div className="flex h-12 items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="hidden md:block">
                                                <div className="flex items-baseline space-x-4">
                                                    {navigation.map((item) => (
                                                        <button
                                                            key={item.name}
                                                            onClick={() => {
                                                                tabChange(item);
                                                            }}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-gray-900 text-white'
                                                                    : 'text-black hover:bg-gray-700 hover:text-white',
                                                                'rounded-md px-3 py-2 text-sm font-medium'
                                                            )}
                                                        >
                                                            {item.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <a href="tickets/new" className="colors_button_support text-black border border-black rounded-md px-3 py-2 text-sm font-medium ">New ticket</a>
                                    </div>
                                </div>
                            </>
                        )}
                    </Disclosure>
                    <div className="w-full h-full">
                        <div className="flex-col flex w-full place-content-between px-2 py-2">
                            <div className="flex-row flex w-full place-items-center space-x-9">
                                <div className="flex-col flex w-8/12">
                                    <div className="flex-row flex w-full space-x-10">
                                        <div className="w-7/12 h-8">
                                            <TextBox {...title_text}></TextBox>
                                        </div>

                                        <div className="w-5/12 h-8">
                                            <TextBox {...client_cuit_text}></TextBox>
                                        </div>
                                    </div>
                                    <div className="flex-row flex w-full space-x-10 mt-2">
                                        <div className="flex-row flex w-full place-items-center justify-center">

                                            <DatePicker
                                                showIcon
                                                selected={openingDate}
                                                onChange={(date) => changeOpeningDate(date?.toDateString())}
                                                dateFormat="dd/MM/yyyy"
                                                wrapperClassName="w-full"
                                                className="w-full rounded-l-md border border-black text-left h-8"
                                                placeholderText="Filter opening date"
                                            />
                                            <button className="colors_button_alt text-white w-3/12 h-8 rounded-tr-md rounded-br-md border-black border-r border-t border-b" onClick={() => changeOpeningDate(undefined)}>Clear</button>
                                        </div>
                                        <div className="flex-row flex w-full place-items-center justify-center">

                                            <DatePicker
                                                showIcon
                                                selected={closingDate}
                                                onChange={(date) => changeClosingDate(date?.toDateString())}
                                                dateFormat="dd/MM/yyyy"
                                                wrapperClassName="w-full"
                                                className="w-full rounded-l-md border border-black text-left h-8"
                                                placeholderText="Filter closing date"
                                            />
                                            <button className="colors_button_alt text-white w-3/12 h-8 rounded-tr-md rounded-br-md border-black border-r border-t border-b" onClick={() => changeClosingDate(undefined)}>Clear</button>
                                        </div>
                                        {
                                            actual_type === 1 &&
                                            <div className="w-11/12 h-8">
                                                <ComboBox {...severity_combo} />
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="flex-col flex w-5/12">
                                    <div className="flex-row flex w-full space-x-10">
                                        <div className="w-7/12 h-8">
                                            <ComboBox {...status_combo} />
                                        </div>
                                        <button className="colors_button_support w-6/12 rounded-md border border-black h-8" onClick={() => applyFilters(actual_type)}> Apply filters</button>
                                    </div>
                                    {
                                        actual_type === 1 &&
                                        <div className="flex-row flex w-full space-x-10 mt-2">
                                            <div className="w-3/12 h-8">
                                                <TextBox {...impact_text}></TextBox>
                                            </div>

                                            <div className="w-3/12 h-8">
                                                <TextBox {...duration_text}></TextBox>
                                            </div>

                                            <div className="w-6/12 h-8">
                                                <ComboBox {...response_time_combo} />
                                            </div>
                                        </div>
                                    }

                                    {
                                        actual_type === 0 &&
                                        <div className="h-8 mt-2"></div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="w-full shadow">
                            <Table {...tbl_items}></Table>
                        </div>
                    </div>
                </div>
                <Link className="place-self-end flex justify-center text-center mt-2 bg-red-400 h-10 w-20 colors_button_support text-center text-black border border-black rounded-md" href={{ pathname: `/products/${product_id}/versions` }}>
                    <Button>
                        Go back
                    </Button>
                </Link>
            </div>
        </div >
    )
}
