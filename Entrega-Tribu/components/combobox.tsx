import { Button, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { IComboBoxItems } from './types'

export default function ComboBox({ combo_items, data, default_value, def_option }: IComboBoxItems) {
    const [selectedItem, setSelectedItem] = useState(def_option);

    const changeData = (item: any) => { data.data = item; setSelectedItem(item); }
    const clearData = () => { data.data = def_option; setSelectedItem(def_option) }

    useEffect(() => {
        if (default_value !== undefined) {
            changeData(default_value);
        } else {
            changeData(def_option)
        }
    }, [])

    return (
        <div className='flex-row flex'>
            <Listbox value={selectedItem} onChange={(item: any) => { item == undefined ? changeData(selectedItem) : changeData(item) }}>
                <ListboxButton className="pl-1 bg-white text-left truncate rounded-bl-md rounded-tl-md border-black border h-8 w-10/12">{selectedItem.name}</ListboxButton>
                <ListboxOptions className="bg-white rounded-rb-md truncate border-black text-black border-r border-l border-b" anchor="bottom">
                    {combo_items.map((item) => (
                        <ListboxOption key={item.id} value={item} className="px-1 truncate data-[focus]:bg-blue-100">
                            {item.name}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </Listbox >
            <Button className=" colors_button_alt text-white w-2/12 h-8 rounded-tr-md rounded-br-md border-black border-r border-t border-b border-l" onClick={clearData}>Clear</Button>
        </div >
    )
}