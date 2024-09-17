import { Button } from "@headlessui/react";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { classNames, convertDateMMDDYYYYToDDMMYYYY } from "./utils";
import { StatusLabel } from "./incidentGridRow";

export default function QueryGridRow({ query, style }: { query: any, style: boolean }) {

    const router = useRouter();

    return (
        <div className={classNames(style ? classNames(query['id'] !== '' ? 'border-b border-gray-200 text-center align-middle' : '') : 'hidden')}>

            <div className={"flex-row text-center text-black flex truncate justify-items-center justify-center place-items-center"} key={`${query['id']}`}>
                <div className={classNames(query['id'] !== '' ? 'px-6 w-1/12 py-4 border-black truncate overflow-hidden' : 'py-4 h-[57px]')}>
                    {query['id']}
                </div>

                {
                    query['id'] !== '' &&
                    <div className="py-4 w-3/12 whitespace-no-wrap text-center">
                        {query['client_id']['CUIT']}
                    </div>
                }

                <div className={classNames(query['id'] !== '' ? ' truncate py-4 w-full overflow-hidden' : 'py-4 h-[57px]')}>
                    {query['title']}
                </div>

                {
                    query['id'] !== '' &&
                    <div className="py-4 w-5/12 whitespace-no-wrap text-center">
                        {StatusLabel(query['status'])}
                    </div>
                }

                {
                    query['id'] !== '' &&
                    <div className="py-4 w-3/12 whitespace-no-wrap text-center">
                        {convertDateMMDDYYYYToDDMMYYYY(query['opening_date'])}
                    </div>
                }

                {
                    query['id'] !== '' &&
                    <div className="py-4 w-3/12 whitespace-no-wrap text-center">
                        {convertDateMMDDYYYYToDDMMYYYY(query['closing_date'])}
                    </div>
                }


                {
                    query['id'] !== '' &&
                    <div className="whitespace-no-wrap w-3/12 flex py-2 justify-center text-center">
                        <nav>
                            <Link href={{ pathname: `${router.asPath}/${query['id']}` }}>
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
