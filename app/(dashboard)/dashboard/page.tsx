
import { auth } from '@/auth'
import ChatSection from '@/components/pages/dashboard/chat/ChatSection'
import NoteSection from '@/components/pages/dashboard/note/NoteSection'
import { NextPage } from 'next'

interface Props { }

const Page: NextPage<Props> = async ({ }) => {
  const session = await auth()
  return <div className='flex-1 flex items-start gap-4 '>
    <ChatSection session={session} />
    {/* <NoteSection session={session} /> */}
  </div>
}

export default Page