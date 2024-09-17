import { Button, Label } from "@headlessui/react";
import EmployeeGridRow from "./employeeGridRow";
import TaskRow from "./taskRow";
import ProjectGridRow from "./projectGridRow";
import React, { useEffect, useState } from 'react';
import { Data } from "./types"
import ProductGridRow from "./productGridRow";
import VersionGridRow from "./versionGridRow";
import QueryGridRow from "./queryGridRow";
import IncidentGridRow from "./incidentGridRow";
import TicketTaskRow from "./ticketTaskRow";

function HeaderItem({ title, width }: HeaderItems) {
    return <div className={width + " font-bold py-1 text-sm text-center align-middle text-black border-b border-gray-200 bg-gray-100"}>{title}</div>
}

export interface HeaderItems {
    title: string,
    width: string
}

export interface ITableItems {
    headers: HeaderItems[],
    row_type: string,
    row_items: any[],
    n_items_col: number | undefined
    new_tab: Tab | undefined,
    data: Data[] | undefined
}


export class Tab {
    tab: boolean = true;

    public set() {
        this.tab = true;
    }

    public clear() {
        this.tab = false;
    }
}

function selectGrid(key: string, item: any, data: Data[] | undefined, style: boolean) {
    switch (key) {
        case "project":
            return <ProjectGridRow project={item} style={style} />
        case "task":
            return <TaskRow task={item} style={style} />
        case "product":
            return <ProductGridRow product={item} style={style} />
        case "version":
            return <VersionGridRow version={item} style={style} />
        case "incident":
            return <IncidentGridRow incident={item} style={style} />
        case "query":
            return <QueryGridRow query={item} style={style} />
        case "ticket_task":
            return <TicketTaskRow key={`${item.id}, ${item.project_id}`} task={item} style={style} data={data} />

        default:
            return <div></div>
    }
}

function sliceItems(items: any[], start: number, n_items_col: number) {
    if (start < 0) {
        start = 0;
    }

    var end = start + n_items_col;

    if (end > items.length) {
        end = items.length
    }

    return items.slice(start, end);
}

function genDummies(max: number) {
    const dummies: any[] = [];

    for (let index = 0; index < max; index++) {
        dummies.push({ id: "", name: "" });
    }

    return dummies;
}

export default function Table({ headers, row_items, row_type, n_items_col = 5, new_tab, data }: ITableItems) {

    let [page, setPage] = useState(1);

    const ids = new Set<any>();
    const filtered_rows: any[] = row_items.filter(({ id, project_id }) => !ids.has(`${id}, ${project_id}`) && ids.add(`${id}, ${project_id}`))

    const pages: number = Math.ceil(filtered_rows.length / n_items_col);

    useEffect(() => {
        if (new_tab?.tab == true) {
            new_tab?.clear();
            setPage(1);
        }
    });

    return (
        <div className="flex flex-col rounded-b-md h-full w-full bg-white">

            <div className="flex flex-row w-full place-items-center">
                {headers.map((header) => (
                    <HeaderItem {...header} key={header.title} />
                ))}
            </div>

            <div className="truncate w-full h-full">
                {
                    filtered_rows.map((item) => (
                        selectGrid(
                            row_type,
                            item,
                            data,
                            sliceItems(filtered_rows, (page - 1) * n_items_col, n_items_col).includes(item)
                        )
                    ))
                } {
                    genDummies(n_items_col - (filtered_rows.length === 0 ? 0 : (filtered_rows.length % n_items_col === 0 ? n_items_col : filtered_rows.length % n_items_col))).map((item) => (
                        selectGrid(
                            row_type,
                            item,
                            data,
                            (page === pages) || pages === 0
                        )
                    ))
                }

            </div>
            {
                <div className="h-10">
                    {
                        pages > 1 &&
                        <div className="flex-row m-2 flex justify-center place-items-center">
                            <Button onClick={() => { if (page > 1) { setPage(page - 1) } }} className="border-t border-l border-r border-b border-black pl-2 pr-2">Prev</Button>
                            <label className="border-t border-b border-black pl-2 pr-2">{page + " "}/{ }{" " + pages}</label>

                            <Button onClick={() => { if (page < pages) { setPage(page + 1) } }} className="border-t border-r border-l border-b border-black pl-2 pr-2">Next</Button>
                        </div>
                    }
                </div>
            }
        </div >
    )


}