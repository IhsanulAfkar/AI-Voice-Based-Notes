
import { auth } from '@/auth'
import ChatSection from '@/components/pages/dashboard/chat/ChatSection'
import NoteSection from '@/components/pages/dashboard/note/NoteSection';


interface Params {
    params: { id: string };
}
const Page = async ({ params }: Params) => {
    const { id } = await params
    let session = await auth()

    return <div className='flex-1 flex md:flex-row flex-col-reverse items-start gap-4 '>
        <ChatSection session={session} conversationId={id} />
        <NoteSection session={session} conversationId={id} />
    </div>
}

export default Page