import { Checkbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Data } from "./types"
import { classNames } from "./utils";

export default function EmployeeGridRow({ employee, style, data }: { employee: any, style: boolean, data: Data[] | undefined }) {
    const [enabled, setEnabled] = useState(false)

    // Employee currently assigned to the project?
    useEffect(() => {
        var index: number = -1;

        data?.forEach(element => {
            if (element.data['id'] === employee['id']) {
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

            data?.forEach(element => {
                if (element.data['id'] === employee['id']) {
                    index = data?.indexOf(element);
                }
            });

            if (index !== -1) {
                data?.splice(index, 1);
            }

            setEnabled(false);

        } else {
            data?.push(new Data(employee))
            setEnabled(true);
        }
    }

    return (
        <div className={classNames(style ? '' : 'hidden')}>
            <div className={"flex-row text-center text-black whitespace-nowrap flex truncate justify-items-center justify-center place-items-center"} key={employee['id']} >
                <div className={classNames(employee['id'] !== '' ? ' py-4 truncate w-2/12 border-b border-gray-200' : 'py-4 h-[57px]')}>
                    {employee['id']}
                </div>

                <div className={classNames(employee['id'] !== '' ? 'pl-2 py-4 truncate w-full border-b border-gray-200' : 'py-4 h-[57px]')}>
                    {employee['name']}
                </div>

                {
                    employee['id'] !== '' && data !== undefined &&
                    <div className="flex py-3 justify-center border-b border-gray-200 w-3/12 text-center">
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
            </div >
        </div >
    )
}
