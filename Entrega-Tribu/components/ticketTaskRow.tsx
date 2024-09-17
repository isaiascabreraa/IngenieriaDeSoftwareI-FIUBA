
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { Data, Task } from "@/components/types";
import { Button, Checkbox } from "@headlessui/react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { classNames, convertDateMMDDYYYYToDDMMYYYY } from './utils';

export function mapPriority(priority: number) {
    switch (priority) {
        case 0:
            return <div className="w-full text-sm rounded-2xl leading-5 text-black bg-sky-500 text-center border-black border">Low</div>;
        case 1:
            return <div className="w-full text-sm rounded-2xl leading-5 text-black bg-yellow-500 text-center border-black border">Moderate</div>
        case 2:
            return <div className="w-full text-sm rounded-2xl leading-5 text-black bg-rose-500 text-center border-black border">High</div>
        default:
            return <div className="w-full text-sm bg-black rounded-2xl leading-5 text-black text-center border-black border"></div>
    }
}

export function StatusLabel(status: number) {

    switch (status) {
        case 0:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_new text-center border-black border-double border">New</div>

        case 1:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_in_progress text-center border-black border-double border">In progress</div>;

        case 2:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_fixed text-center border-black border-double border">Finished</div>;

        case 3:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_closed text-center border-black border-double border">Closed</div>;

        default:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_blocked text-center border-black border-double border">Blocked</div>;
    }
}

const TicketTaskRow = ({ task, style, data }: { task: any, style: boolean, data: any }) => {

    const router = useRouter()
    const [enabled, setEnabled] = useState(false)

    // Task currently assigned to the ticket?
    useEffect(() => {
        var index: number = -1;

        data?.forEach((element: any) => {
            if (element.data['id'] === task['id'] && element.data.project_id === task.project_id) {
                index = data?.indexOf(element);
            }
        });

        if (index !== -1) {
            setEnabled(true);
        }
    }, [])

    const handleEnable = () => {

        if (enabled) {
            var index: number = -1;

            data?.forEach((element: any) => {
                if (element.data['id'] === task['id'] && element.data.project_id === task.project_id) {
                    index = data?.indexOf(element);
                }
            });

            if (index !== -1) {
                data?.splice(index, 1);
            }

            setEnabled(false);

        } else {
            data?.push(new Data(task))
            setEnabled(true);
        }
    }

    return (
        <div className={classNames(style ? classNames(task['id'] !== '' ? 'border-b text-black border-gray-200' : '') : 'hidden')}>

            <div className={"flex-row w-full text-center text-black flex truncate justify-items-center justify-center place-items-center"} key={`${task['id']}`}>

                <div className={classNames(task['id'].toString() !== '' ? 'px-6 w-1/12 py-4 border-black truncate overflow-hidden' : 'py-4 h-[57px]')}>
                    {task['id']}
                </div>

                <div className={classNames(task['title'] !== '' ? 'pl-1 truncate py-4 w-full overflow-hidden' : 'py-4 h-[57px]')}>
                    {task['title']}
                </div>

                {
                    task['id'].toString() !== '' &&
                    <div className="py-4 w-7/12 truncate whitespace-no-wrap overflow-hidden text-center">
                        {task.project_title}
                    </div>
                }
                {
                    task['id'].toString() !== '' &&
                    <div className="py-4 w-7/12 truncate whitespace-no-wrap overflow-hidden text-center">
                        {task.worker_id == undefined ? 'Waiting for assignment' : task.worker_id.name}
                    </div>
                }

                {
                    task['id'].toString() !== '' &&
                    <div className="py-4 w-4/12  truncate whitespace-no-wrap text-center">
                        {convertDateMMDDYYYYToDDMMYYYY(task['start_date'])}
                    </div>
                }

                {
                    task['id'].toString() !== '' &&
                    <div className="py-4 w-4/12  truncate whitespace-no-wrap text-center">
                        {convertDateMMDDYYYYToDDMMYYYY(task['end_date'])}
                    </div>
                }

                {
                    task['id'].toString() !== '' &&
                    <div className="py-4 w-4/12 whitespace-no-wrap text-center">
                        {StatusLabel(task['status'])}
                    </div>
                }

                {
                    task['id'].toString() !== '' &&
                    <div className="py-4 w-3/12 ml-2 truncate whitespace-no-wrap flex justify-center text-center">
                        {mapPriority(task['priority'])}
                    </div>
                }

                {
                    task['id'].toString() !== '' &&
                    <div className="flex py-3 justify-center w-3/12 text-center">
                        <Checkbox
                            checked={enabled}
                            onChange={handleEnable}
                            className="group block size-4 rounded border border-black w-8 h-8 bg-white data-[checked]:bg-blue-500"
                        >
                            {/* Checkmark icon */}
                            <svg className="stroke-white opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
                                <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Checkbox>
                    </div >

                }
                {

                    task['id'].toString() !== '' &&
                    <div className="whitespace-no-wrap w-4/12 flex py-2 justify-center text-center">
                        <nav>

                            <Link href={{ pathname: `/projects/${task['project_id']}/tasks/${task['id']}` }}>
                                <Button className={"flex-row flex justify-center place-items-center rounded-2xl text-gray-700 border-gray-700 border bg-slate-200 h-10 w-32"}>
                                    Details
                                    <DocumentMagnifyingGlassIcon className="w-8 h-8"></DocumentMagnifyingGlassIcon>
                                </Button>
                            </Link>

                        </nav>
                    </div >
                }

            </div>
        </div>
    );
};

export default TicketTaskRow;

