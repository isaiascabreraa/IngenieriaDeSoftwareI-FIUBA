import { Button } from "@headlessui/react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { classNames, convertDateMMDDYYYYToDDMMYYYY } from "./utils";

export function StatusLabel(status: number) {

    switch (status) {
        case 0:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_new text-center border-black border-double border">New</div>

        case 1:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_in_progress text-center border-black border-double border">In progress</div>;

        case 2:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_fixed text-center border-black border-double border">Finished</div>;

        default:
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_closed text-center border-black border-double border">Closed</div>;
    }
}

export default function ProjectGridRow({ project, style }: { project: any, style: boolean }) {

    return (
        <div className={classNames(style ? classNames(project['id'] !== '' ? 'border-b border-gray-200' : '') : 'hidden')}>

            <div className={"flex-row text-center text-black flex truncate justify-items-center justify-center place-items-center"} key={`${project['id']}`}>
                <div className={classNames(project['id'] !== '' ? 'px-6 w-1/12 py-4 border-black truncate overflow-hidden' : 'py-4 h-[57px]')}>
                    {project['id']}
                </div>

                <div className={classNames(project['id'] !== '' ? 'pl-1 truncate py-4 w-full overflow-hidden' : 'py-4 h-[57px]')}>
                    {project['name']}
                </div>

                {
                    project['id'] !== '' &&
                    <div className="py-4 w-7/12  truncate whitespace-no-wrap text-center">
                        {project.leader === undefined ? 'Waiting for assignment' : project.leader.name}
                    </div>
                }

                {
                    project['id'] !== '' &&
                    <div className="py-4 w-4/12 whitespace-no-wrap text-center">
                        {convertDateMMDDYYYYToDDMMYYYY(project['deadline'])}
                    </div>
                }

                {
                    project['id'] !== '' &&
                    <div className="py-4 w-4/12 whitespace-no-wrap text-center">
                        {StatusLabel(project['status'])}
                    </div>
                }

                {
                    project['id'] !== '' &&
                    <div className="whitespace-no-wrap w-4/12 flex py-2 justify-center text-center">
                        <nav>
                            <Link href={{ pathname: `/projects/${project['id']}` }}>
                                <Button className={"flex-row flex justify-center place-items-center rounded-2xl text-gray-700 border-gray-700 border bg-slate-200 h-10 w-32"}>
                                    Details
                                    <DocumentMagnifyingGlassIcon className="w-8 h-8"></DocumentMagnifyingGlassIcon>
                                </Button>
                            </Link>
                        </nav>
                    </div >
                }
            </div >
        </div>
    )
}
