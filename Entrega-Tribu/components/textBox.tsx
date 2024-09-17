import { Textarea } from "@headlessui/react";
import { Data } from "./types"
import { useState } from "react";

export default function TextBox({ title, description, id, className, data, default_value, style }: { title: string, description: string, id: string, className: string, data: Data, default_value: string | undefined, style: {} }) {
    const [input, setInput] = useState('');

    const handleChange = (event: any) => {
        const newValue = event.target.value;
        setInput(newValue);
        data.data = input;
    }

    return (
        <div>
            {
                title !== '' &&
                <label className="block text-xl pb-1 font-medium leading-6 text-gray-900">
                    {title}
                </label>
            }
            <div className="relative rounded-md shadow-sm" >
                <Textarea
                    defaultValue={default_value === undefined ? "" : default_value}
                    name={id}
                    id={id}
                    className={className}
                    style={style}
                    placeholder={description}
                    onKeyUp={handleChange}
                    onInput={handleChange}
                />
            </div>
        </div >
    )
}
