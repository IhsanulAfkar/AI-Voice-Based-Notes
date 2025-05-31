import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NextPage } from 'next'

interface Props { }

const Message: NextPage<Props> = ({ }) => {
    return <div className="flex items-start gap-2.5">
        <img className="w-8 h-8 rounded-full" src="/assets/icons/logo/logo.svg" alt="Jese image" />
        <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <p className="text-sm font-normal text-gray-900 dark:text-white"> That's awesome. I think our users will really appreciate the improvements.</p>
            </div>
        </div>
    </div>

}

export default Message