"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Plus
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Session, User } from 'next-auth'
import { NavConversation } from "./nav-conversations"
import { Conversation } from "@prisma/client"
import { useConversations } from "@/hooks/useConversations"
import route from "@/route"
// This is sample data.
const dummyData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "New Chat",
      url: route('dashboard'),
      icon: Plus,
      isActive: true,
    },

    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
}

type TAppSidebar = {
  props?: React.ComponentProps<typeof Sidebar>,
  user?: User | null
}
export function AppSidebar({ props, user }: TAppSidebar) {
  const { data, error, isLoading } = useConversations()
  if (error) {
    console.error(error)
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 overflow-hidden">
          <Image src={'/assets/icons/logo/logo.svg'} alt="logo" width={50} height={50} />
          <p className="font-bold text-xl">Sound Note</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dummyData.navMain} />
        <NavConversation conversations={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
