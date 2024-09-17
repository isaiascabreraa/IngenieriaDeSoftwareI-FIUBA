import { Button } from "@headlessui/react";
import { DocumentMagnifyingGlassIcon, TagIcon, TicketIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { classNames } from "./utils";

export default function VersionGridRow({ version, style }: { version: any, style: boolean }) {
    const [descriptionMore, setDescriptionMore] = useState(false);

    const router = useRouter();

    const seeDescription = () => {
        setDescriptionMore(!descriptionMore);
    }

    return (
        <div className={classNames(style ? classNames(version['id'] !== '' ? 'border-b border-gray-200' : '') : 'hidden')}>

            <div className={"flex-row text-center text-black flex truncate justify-items-center justify-center place-items-center"} key={`${version['id']}`}>
                <div className={classNames(version['id'] !== '' ? 'px-6 w-1/12 py-4 border-black truncate overflow-hidden' : 'py-4 h-[57px]')}>
                    {version['id']}
                </div>

                {
                    version['id'] !== '' &&
                    <div className={classNames(version['id'] !== '' ? 'place-items-center pl-1 whitespace-normal align-middle py-4 w-9/12 text-ellipsis max-h-40' : 'py-4 h-[57px]')}>
                        {(descriptionMore ? version['release_notes'] : version['release_notes'].slice(0, 88)) + (version['release_notes'].length > 88 && !descriptionMore ? "..." : "")}
                        {
                            version['release_notes'].length > 88 &&
                            <button className="ml-2 text-sky-500 underline" onClick={seeDescription}>{descriptionMore ? "show less" : "show more"}</button>
                        }
                    </div>
                }

                {
                    version['id'] !== '' &&
                    <div className="whitespace-no-wrap w-2/12 flex py-2 justify-center text-center">
                        <nav>
                            <Link href={{ pathname: `${router.asPath}/${version['id']}/tickets` }}>
                                <Button className={"flex-row flex justify-center place-items-center rounded-2xl text-gray-700 border-gray-700 border bg-slate-200 h-10 w-32"}>
                                    Tickets
                                    <TicketIcon className="w-8 h-8"></TicketIcon>
                                </Button>
                            </Link>
                        </nav>
                    </div >
                }
            </div >
        </div>
    )
}
