
import React from 'react';
import { useRouter } from "next/router";
import { Task } from "@/components/types";
import { Button } from "@headlessui/react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { classNames, convertDateMMDDYYYYToDDMMYYYY } from './utils';

interface TaskRowProps {
    task: Task;
    style: boolean;
}

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

const TaskRow: React.FC<TaskRowProps> = ({ task, style }) => {

    const router = useRouter()

    return (
        <div className={classNames(style ? classNames(task['id'].toString() !== '' ? 'border-b text-black border-gray-200' : '') : 'hidden')}>

            <div className={"flex-row w-full text-center text-black flex truncate justify-items-center justify-center place-items-center"} key={`${task['id']}`}>

                <div className={classNames(task['id'].toString() !== '' ? 'px-6 w-1/12 py-4 border-black truncate overflow-hidden' : 'py-4 h-[57px]')}>
                    {task['id']}
                </div>

                <div className={classNames(task['title'] !== '' ? 'pl-1 truncate py-4 w-full overflow-hidden' : 'py-4 h-[57px]')}>
                    {task['title']}
                </div>

                {
                    task['id'].toString() !== '' &&
                    <div className="py-4 w-7/12 truncate whitespace-no-wrap text-center">
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
                    <div className="py-4 w-2/12 ml-2 truncate whitespace-no-wrap flex justify-center text-center">
                        {mapPriority(task['priority'])}
                    </div>
                }

                {
                    task['id'].toString() !== '' &&
                    <div className="whitespace-no-wrap w-4/12 flex py-2 justify-center text-center">
                        <nav>

                            <Link href={{ pathname: `${router.asPath}/${task['id']}` }}>
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

export default TaskRow;

