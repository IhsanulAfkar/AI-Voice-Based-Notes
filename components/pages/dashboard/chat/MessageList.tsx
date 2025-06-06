import { NextPage } from 'next'
import Message from './Message'
import { Message as TMessage } from '@prisma/client'
import { useEffect, useRef } from 'react'

interface Props {
    messages: TMessage[],
    isStreaming?: boolean,
    currentMessage?: string,
    currentDate?: Date
}

const MessageList: NextPage<Props> = ({ messages }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = containerRef.current;
        if (el) {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]); // Scrolls every time messages change

    return <div
        id="chat-container"
        ref={containerRef}
        className="flex-1 h-full overflow-y-auto flex flex-col gap-6 pr-4 w-full max-w-4xl mx-auto"
    >
        {messages.map(message => (<Message data={message} key={message.id} />
        ))}

        <div className='h-16 py-16'></div>
    </div>
}

export default MessageList