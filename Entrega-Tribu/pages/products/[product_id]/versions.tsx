import { useEffect, useState } from "react";
import ComboBox from "@/components/combobox";
import Table, { ITableItems, Tab } from "@/components/table";
import { Data, IComboBoxItems } from "@/components/types";
import TextBox from "@/components/textBox";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { Button } from "@headlessui/react";
import { backHost } from "@/types/types";
import { useRouter } from "next/router";

const filters = {
    notes: new Data(""),
    v_code: new Data('')
}

function filterListByStatus(notes: string, v_code: string,
    list: any[]) {

    if (notes !== "" && notes !== undefined) {
        list = list.filter(item => item.release_notes.toLowerCase().search(notes.toLowerCase()) !== -1)
    }

    if (v_code !== "" && v_code !== undefined) {
        list = list.filter(item => item.version_code.toLowerCase().search(v_code.toLowerCase()) !== -1)
    }

    return list;
}

var product_id: any;

export default function Versions() {

    const router = useRouter();

    const [versions, setVersions]: any[] = useState(undefined)
    var [filtered_list, setFilteredList]: any[] = useState(undefined);

    useEffect(() => {

        if (!router.isReady) {
            return;
        }

        product_id = router.query.product_id;
        product_id = +product_id;

        fetch(`${backHost.support}/products/${product_id}/versions`)
            .then((response) => {
                if (response.status === 500) {
                    setVersions([])
                    setFilteredList([])
                    return;
                }

                return response.json()
            })
            .then((data) => {
                data = data.map((_version: any) => { return { ..._version, id: _version.version_code } })
                setVersions(data);
                setFilteredList(data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [router.isReady])

    if (!versions) {
        return (
            <div className="w-full h-full colors_background_support flex place-content-center">
                <img className="w-1/8 h-1/5 place-self-center" src={"https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif"} alt="loading..." />
            </div>
        )
    }

    let tbl_items: ITableItems = {
        headers: [{
            title: "ID",
            width: "px-6 + w-1/12"

        }, {
            title: "Release notes",
            width: "w-9/12"

        }, {
            title: "Tickets",
            width: "w-2/12"

        }],
        row_type: "version",
        row_items: filtered_list,
        n_items_col: 10,
        new_tab: new Tab(),
        data: []
    }

    const notes = {
        title: '',
        description: "Filter notes",
        id: "notes",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.notes,
        default_value: undefined,
        style: { overflow: 'hidden' }
    }

    const v_code = {
        title: '',
        description: "Filter version code",
        id: "v_code",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.v_code,
        default_value: undefined,
        style: { overflow: 'hidden' }
    }

    const applyFilters = () => {
        setFilteredList(filterListByStatus(
            filters.notes.data, filters.v_code.data, versions
        ))
    }

    return (
        <div className="colors_background_support px-2 w-full h-full flex-col flex place-content-center items-center text-black">
            <div className='m-5 w-full place-content-end flex flex-col'>
                <div className='text-left pl-2 colors_header_support h-8 border-t border-l border-r border-black rounded-t-md text-xl text-white'>See all product { } versions</div>
                <div className="h-11/12 w-full border border-black rounded-b-md ">
                    <div className="w-full">
                        <div className="flex-row flex place-items-center justify-center px-6 py-2">
                            <div className="flex-col flex w-full place-content-between">
                                <div className="flex-row flex w-full justify-between space-x-10 place-items-center">
                                    <div className="w-2/12 h-8">
                                        <TextBox {...v_code}></TextBox>
                                    </div>

                                    <div className="w-8/12 h-8">
                                        <TextBox {...notes}></TextBox>
                                    </div>

                                    <button className="colors_button_support w-2/12 rounded-md border border-black h-8" onClick={applyFilters}> Apply filters</button>
                                </div>
                            </div>

                        </div>
                        <div className="w-full shadow">
                            <Table {...tbl_items}></Table>
                        </div>
                    </div>
                </div>
                <Link className="place-self-end flex justify-center text-center mt-2 bg-red-400 h-10 w-20 colors_button_support text-center text-black border border-black rounded-md" href={{ pathname: `/products/` }}>
                    <Button>
                        Go back
                    </Button>
                </Link>
            </div>
        </div >
    )
}
