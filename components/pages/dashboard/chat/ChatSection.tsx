import { Input } from '@/components/ui/input'
import { TSession } from '@/types'
import { NextPage } from 'next'
import Message from './Message'

interface Props {
  session: TSession | null
}

const ChatSection: NextPage<Props> = ({ }) => {
  return <>
    <div className="flex-1 flex flex-col w-full h-[90vh] relative rounded-md">
      <div
        id="chat-container"
        className="flex-1 overflow-y-auto flex flex-col gap-4 pr-4 w-full max-w-4xl mx-auto"
      >
        {[1, 2, 3, 4, 5].map((i) => (<Message key={i} />
        ))}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 bg-white p-3 shadow-md rounded-full flex items-center z-10 border-[#CBD5E1] w-full max-w-sm">
        <input type="text" className='appearance-none outline-none w-full' />
      </div>
    </div>

  </>
}

export default ChatSection