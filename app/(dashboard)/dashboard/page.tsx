
import { auth } from '@/auth'
import ChatSection from '@/components/pages/dashboard/chat/ChatSection'
import { NextPage } from 'next'

interface Props { }

const Page: NextPage<Props> = async ({ }) => {
  const session = await auth()
  return <div className='flex-1 flex items-start gap-4 '>
    <ChatSection session={session} />

    <div className='flex-none w-full max-w-xs sticky top-0 self-start'>
      Notes
    </div>
  </div>
}

export default Page