
import { auth } from '@/auth'
import { AppSidebar } from '@/components/app-sidebar'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { NextPage } from 'next'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const Layout: NextPage<Props> = async ({ children }) => {
    const session = await auth()
    return <SidebarProvider>
        <AppSidebar session={session} />
        <SidebarInset className=''>
            <header className="fixed flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-12 h-full max-h-screen">
                {children}
            </div>
        </SidebarInset>
    </SidebarProvider>
}

export default Layout