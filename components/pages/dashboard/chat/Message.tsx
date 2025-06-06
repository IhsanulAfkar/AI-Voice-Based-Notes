import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Message as TMessage } from '@prisma/client'
import { NextPage } from 'next'
import { marked } from 'marked'
interface Props {
    data: TMessage
}

const Message: NextPage<Props> = ({ data }) => {
    if (data.role == 'user') {

        return <div className="flex items-start gap-2.5">
            <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl rounded-tr-none dark:bg-gray-700">
                    <p className="text-sm font-normal text-gray-900 dark:text-white prose" dangerouslySetInnerHTML={{ __html: marked(data.content) }}></p>
                </div>
            </div>
            <img className="w-8 h-8 rounded-full" src="/assets/icons/logo/logo.svg" alt="Jese image" />
        </div>
    }
    return <div className="flex items-start gap-2.5">
        <img className="w-8 h-8 rounded-full" src="/assets/icons/logo/logo.svg" alt="Jese image" />
        <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col leading-1.5 px-4 rounded-e-xl rounded-es-xl">
                <p className="text-sm font-normal min-w-full text-gray-900 dark:text-white prose" dangerouslySetInnerHTML={{ __html: marked(data.content) }}></p>
            </div>
        </div>
    </div>
}

export default Message