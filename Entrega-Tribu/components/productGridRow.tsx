import { Button } from "@headlessui/react";
import { DocumentMagnifyingGlassIcon, TagIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { classNames } from "./utils";

export default function ProductGridRow({ product, style }: { product: any, style: boolean }) {

    return (
        <div className={classNames(style ? classNames(product['id'] !== '' ? 'border-b border-gray-200' : '') : 'hidden')}>

            <div className={"flex-row text-center text-black flex truncate justify-items-center justify-center place-items-center"} key={`${product['id']}`}>
                <div className={classNames(product['id'] !== '' ? 'px-6 w-1/12 py-4 border-black truncate overflow-hidden' : 'py-4 h-[57px]')}>
                    {product['id']}
                </div>

                <div className={classNames(product['id'] !== '' ? 'pl-1 truncate py-4 w-full overflow-hidden' : 'py-4 h-[57px]')}>
                    {product['title']}
                </div>

                {
                    product['id'] !== '' &&
                    <div className="whitespace-no-wrap w-4/12 flex py-2 justify-center text-center">
                        <nav>
                            <Link href={{ pathname: `/products/${product['id']}/versions` }}>
                                <Button className={"flex-row flex justify-center place-items-center rounded-2xl text-gray-700 border-gray-700 border bg-slate-200 h-10 w-32"}>
                                    Versions
                                    <TagIcon className="w-8 h-8"></TagIcon>
                                </Button>
                            </Link>
                        </nav>
                    </div >
                }
            </div >
        </div>
    )
}
