import { IFlyoutMenuItem, ISidebarItem } from "./types"
import FlyoutMenuItem from "./flyoutMenu"
import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    PlayCircleIcon,
    PhoneIcon,
    PlusCircleIcon,
    UserPlusIcon,
    UserCircleIcon,
    TagIcon,
    WrenchIcon,
    ArchiveBoxIcon,
    DocumentMagnifyingGlassIcon,
    TrashIcon
} from '@heroicons/react/24/outline'
import SideBarItem from "./SidebarItem"

/*
    En see all projects: modify project
    en modify project: assign project leader, assign employees, version a project
*/

const project: IFlyoutMenuItem = {
    name: "Project",
    menu_items: [
        { name: 'See all projects', description: "See all created projects", href: '/projects', icon: ArchiveBoxIcon },
    ],
    callout_items: []
}

const settings: IFlyoutMenuItem = {
    name: "Settings",
    menu_items: [
        { name: 'Tarea', description: 'Crear y visualizar tareas', href: '#', icon: ChartPieIcon },
        { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
        { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: FingerPrintIcon },
        { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
        { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
    ],
    callout_items: [
        { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
        { name: 'Contact sales', href: '#', icon: PhoneIcon },
    ]
}

/*
    Completen con las acciones que tengan que hacer en soporte, pueden agregar tantos menu items como quieran
    tambien pueden agregar callout items pero recomiendo que sean menos de dos
    Para los iconos ver: https://heroicons.com/outline
*/
const support: IFlyoutMenuItem = {
    name: "Support",
    menu_items: [
        { name: 'Tarea', description: 'Crear y visualizar tareas', href: '#', icon: ChartPieIcon },
        { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
        { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: FingerPrintIcon },
        { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
        { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
    ],
    callout_items: [
        { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
        { name: 'Contact sales', href: '#', icon: PhoneIcon },
    ]
}



export default function Layout({ children }: { children: any }) {
    const menuItems: ISidebarItem[] = [
        {
            href: "/",
            title: "Homepage",
        },
        {
            href: "/projects",
            title: "Projects",
        },
        {
            href: "/products",
            title: "Support",
        }
    ]

    return (
        <div className="min-h-screen h-full flex flex-col bg-white">
            <header>

                <div className="bg-black sticky z-50 h-14 font-semibold uppercase text-white">
                    <nav>
                        <ul className="w-full flex-row flex justify-evenly ">
                            {menuItems.map((item) => (
                                <SideBarItem {...item} key={item.title} />
                            ))}
                        </ul>
                    </nav>
                </div>
            </header >
            <div className="flex flex-1">
                <main className="flex-1">{children}</main>
            </div>
        </div>
    )
}
