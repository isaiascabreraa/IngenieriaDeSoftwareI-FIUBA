import { useEffect, useState } from "react";
import ComboBox from "@/components/combobox";
import Table, { ITableItems, Tab } from "@/components/table";
import { Data, IComboBoxItems } from "@/components/types";
import TextBox from "@/components/textBox";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { backHost } from "@/types/types";

const filters = {
    name: new Data("")
}

function filterListByStatus(name: string,
    list: any[]) {

    if (name !== "" && name !== undefined) {
        list = list.filter(item => item.title.toLowerCase().search(name.toLowerCase()) !== -1)
    }

    return list;
}

export default function Products() {

    const [products, setProducts]: any[] = useState(undefined)
    var [filtered_list, setFilteredList]: any[] = useState(undefined);

    useEffect(() => {
        fetch(`${backHost.support}/products`)
            .then((response) => {
                if (response.status === 500) {
                    setProducts([])
                    setFilteredList([])
                    return;
                }

                return response.json()
            })
            .then((data) => {
                setProducts(data);
                setFilteredList(data)
            })
            .catch((error) => {
                console.log(error)
            })
    })

    if (!products) {
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
            title: "Name",
            width: "w-full"

        }, {
            title: "Versions",
            width: "w-4/12"

        }],
        row_type: "product",
        row_items: filtered_list,
        n_items_col: 10,
        new_tab: new Tab(),
        data: []
    }

    const title = {
        title: '',
        description: "Filter title",
        id: "title",
        className: "whitespace-nowrap text-clip h-8 w-full outline-none text-nowrap resize-none rounded-md border border-black mb-1 py-0.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6",
        data: filters.name,
        default_value: undefined,
        style: { overflow: 'hidden' }
    }

    const applyFilters = () => {
        setFilteredList(filterListByStatus(
            filters.name.data, products
        ))
    }

    return (
        <div className="colors_background_support px-2 w-full h-full flex-col flex place-content-center items-center text-black">
            <div className='border border-black w-full rounded-md rounded-md shadow'>
                <div className='text-left pl-2 colors_header_support h-8 rounded-t-md text-xl text-white'>See all products</div>
                <div className="w-full h-11/12">
                    <div className="w-full">
                        <div className="flex-row flex place-items-center justify-center px-6 py-2">
                            <div className="flex-col flex w-full place-content-between">
                                <div className="flex-row flex w-full justify-between place-items-center">
                                    <div className="w-8/12 h-8">
                                        <TextBox {...title}></TextBox>
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
            </div>
        </div >
    )
}
