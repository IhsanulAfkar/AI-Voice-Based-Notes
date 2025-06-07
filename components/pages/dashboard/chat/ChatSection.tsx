'use client'
import { Input } from '@/components/ui/input'
import { TSession } from '@/types'
import { NextPage } from 'next'
import Message from './Message'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import MessageList from './MessageList'
import { usePathname, useRouter } from 'next/navigation'
import { Conversation } from '@prisma/client'
import route from '@/route'
import { useConversationHistory } from '@/hooks/useConversationHistory'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  session: TSession | null,
  conversationId?: string
}

const ChatSection: NextPage<Props> = ({ session, conversationId }) => {
  const { data, refetch } = useConversationHistory(conversationId)
  const currentDate = new Date()
  const router = useRouter();
  const pathname = usePathname();
  const [inputQuery, setInputQuery] = useState('')
  const [messages, setmessages] = useState<typeof Message[]>([])
  const [currentMessage, setcurrentMessage] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const sendChat = async () => {
    if (!inputQuery.trim()) return;
    const newChat = inputQuery.trim()
    setInputQuery('')
    if (!conversationId) {
      // create new conversation with user message
      const response = await fetch('/api/conversation', {
        method: 'POST',
        body: JSON.stringify({
          message: newChat
        })
      })
      if (response.ok) {
        const result: Conversation = await response.json();
        sessionStorage.setItem('newConversationId', result.uuid);
        router.push(route('dashboard.conversation', { conversationId: result.uuid }))
      } else {
        toast.error('Send Chat Failed')
        console.error(response.status)
      }
    } else {


      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: newChat,
          user_id: session?.user?.id,
          conversation_id: conversationId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (!contentType?.includes('text/event-stream')) {
          const body = await response.json()
          toast.success(body.message)
          // quick fix
          window.location.reload()
          return
        }
        const reader = response.body?.getReader();
        if (!reader) {
          toast.error('Failed to fetch chat')
          return
        }
        const decoder = new TextDecoder();
        let partial = '';
        let done = false;

        const chunks = []; // to store all 'response' text parts
        setIsStreaming(true)
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            partial += decoder.decode(value, { stream: true });

            // Process each complete line (split by newline)
            let lines = partial.split('\n');

            // Keep the last line in case it's incomplete
            partial = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data:')) {
                try {
                  const jsonStr = trimmed.replace(/^data:\s*/, '');
                  const event = JSON.parse(jsonStr);

                  if (event.response) {
                    chunks.push(event.response);
                    setcurrentMessage(prev => prev + event.response);
                  }

                  if (event.done) {
                    setIsStreaming(false)
                    break;
                  }
                } catch (err) {
                  setIsStreaming(false)
                  console.error('Error parsing JSON from chunk:', err);
                }
              }
            }
          }
        }
      } else {
        toast.error('Send Chat Failed')
        setIsStreaming(false)
      }
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChat()
    }
  };

  useEffect(() => {
    const storageConversationId = sessionStorage.getItem('newConversationId');
    let eventSource: EventSource | null
    if (storageConversationId && storageConversationId === conversationId) {
      // 
      const eventSource = new EventSource(`/api/conversation/${storageConversationId}/first`)
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (!data.done) {
          // chunks
          setcurrentMessage(prev => prev + data.response)
        } else {
          refetch()
        }
        sessionStorage.removeItem('newConversationId')
      }
      eventSource.onerror = () => {
        eventSource.close()
      }

    }
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])
  useEffect(() => {
    refetch()
  }, [isStreaming])
  return <>
    <div className="flex-1 flex flex-col w-full h-[90vh] relative rounded-md">
      {
        data &&
        <MessageList messages={data} isStreaming={isStreaming} currentMessage={currentMessage} currentDate={currentDate} />
      }

      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 bg-white shadow-md rounded-lg flex items-center z-10 border w-full max-w-sm">
        <Textarea onChange={e => setInputQuery(e.target.value)} onKeyDown={handleKeyDown} value={inputQuery} placeholder='Ask Anything' />
      </div>
    </div>

  </>
}

export default ChatSection