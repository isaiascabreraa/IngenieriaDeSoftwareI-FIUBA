import Link from "next/link"
import { useRouter } from "next/router"
import { ISidebarItem } from "./types"

const SideBarItem = ({ href, title }: ISidebarItem) => {
  const router = useRouter()

  return (
    <li className="m-2" key={title}>
      <Link href={href}>
        <span className={`flex items-center w-full p-2 text-xl transition duration-75 rounded-lg group hover:bg-amber-600 flex-1 px-2 text-center whitespace-nowrap ${router.asPath === href && "font-bold bg-white text-black hover:bg-white"}`}>
          {title}
        </span>
      </Link>
    </li>
  )
}

export default SideBarItem
