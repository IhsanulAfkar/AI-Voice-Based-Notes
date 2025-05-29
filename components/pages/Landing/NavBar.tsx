'use client'
import { Navbar1 } from '@/components/navbar1'
import { NextPage } from 'next'
import { Session } from "next-auth";
interface Props {
    session: Session | null
}

const NavBar: NextPage<Props> = ({ session }) => {
    return <Navbar1 session={session} />
}

export default NavBar