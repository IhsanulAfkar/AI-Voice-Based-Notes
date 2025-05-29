import { NextPage } from 'next'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const Layout: NextPage<Props> = ({ children }) => {
    return <div className='flex items-center justify-center h-screen'>{children}</div>
}

export default Layout