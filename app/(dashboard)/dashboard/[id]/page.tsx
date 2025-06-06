
import { auth } from '@/auth'
import ChatSection from '@/components/pages/dashboard/chat/ChatSection'


interface Params {
    params: { id: string };
}
const Page = async ({ params }: Params) => {
    const { id } = await params
    let session = await auth()

    return <div className='flex-1 flex items-start gap-4 '>
        <ChatSection session={session} conversationId={id} />
        {/* <NoteSection session={session} /> */}
    </div>
}

export default Page