import { Button } from "@headlessui/react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { classNames, convertDateMMDDYYYYToDDMMYYYY } from "./utils";

export function StatusLabel(status: number) {

    switch (status) {
        case 0: //new
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_new text-center border-black border-double border">New</div>
        case 1: //in progress
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_in_progress text-center border-black border-double border">In progress</div>;
        case 2: //waiting client
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_waiting_client text-center border-black border-double border">Waiting client</div>;
        case 3: //waiting development
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_waiting_development_team text-center border-black border-double border">Waiting development team</div>;
        case 4: //resolved waiting confirmation
            return <div className="text-sm rounded-2xl leading-5 colors_status_fixed text-center border-black border-double border">Fixed, waiting confirmation</div>;
        case 5: //closed
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_closed text-center border-black border-double border">Closed</div>;
        case 6: //blocked
            return <div className="text-sm rounded-2xl leading-5 text-white colors_status_blocked text-center border-black border-double border">Blocked</div>;
        default:
            return <div className="bg-black"></div>
    }
}

export function mapSeverity(severity: number) {
    switch (severity) {
        case 0:
            return "S1"
        case 1:
            return "S2"
        case 2:
            return "S3"
        case 3:
            return "S4"
        default:
            return ""
    }
}

export function mapResponseTime(response_time: number) {
    switch (response_time) {
        case 0:
            return "14 days"
        case 1:
            return "30 days"
        case 2:
            return "90 days"
        case 3:
            return "365 days"
        default:
            return ""
    }
}

export default function IncidentGridRow({ incident, style }: { incident: any, style: boolean }) {

    const router = useRouter();

    return (
        <div className={classNames(style ? classNames(incident['id'] !== '' ? 'border-b border-gray-200' : '') : 'hidden')}>

            <div className={"flex-row text-center text-black flex truncate justify-items-center justify-center place-items-center"} key={`${incident['id']}`}>
                <div className={classNames(incident['id'] !== '' ? 'px-6 w-1/12 py-4 border-black truncate overflow-hidden' : 'py-4 h-[57px]')}>
                    {incident['id']}
                </div>

                {
                    incident['id'] !== '' &&
                    <div className="py-4 w-3/12 whitespace-no-wrap text-center">
                        {incident['client_id']['CUIT']}
                    </div>
                }

                <div className={classNames(incident['id'] !== '' ? 'truncate py-4 w-full overflow-hidden' : 'py-4 h-[57px]')}>
                    {incident['title']}
                </div>


                {
                    incident['id'] !== '' &&
                    <div className="py-4 w-5/12 whitespace-no-wrap">
                        {StatusLabel(incident['status'])}
                    </div>
                }


                {
                    incident['id'] !== '' &&
                    <div className="py-4 w-3/12 whitespace-no-wrap text-center">
                        {convertDateMMDDYYYYToDDMMYYYY(incident['opening_date'])}
                    </div>
                }

                {
                    incident['id'] !== '' &&
                    <div className="py-4 w-3/12 whitespace-no-wrap text-center">
                        {convertDateMMDDYYYYToDDMMYYYY(incident['closing_date'])}
                    </div>
                }

                {
                    incident['id'] !== '' &&
                    <div className="py-4 w-2/12 whitespace-no-wrap text-center">
                        {mapSeverity(incident['severity_id'])}
                    </div>
                }

                {
                    incident['id'] !== '' &&
                    <div className="py-4 w-2/12 whitespace-no-wrap text-center">
                        {incident['duration']}
                    </div>
                }

                {
                    incident['id'] !== '' &&
                    <div className="py-4 w-3/12 whitespace-no-wrap text-center">
                        {mapResponseTime(incident['severity_id'])}
                    </div>
                }


                {
                    incident['id'] !== '' &&
                    <div className="whitespace-no-wrap w-3/12 flex py-2 justify-center text-center">
                        <nav>
                            <Link href={{ pathname: `${router.asPath}/${incident['id']}` }}>
                                <Button className={"flex-row flex justify-center place-items-center rounded-2xl text-gray-700 border-gray-700 border bg-slate-200 h-10 w-24"}>
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
