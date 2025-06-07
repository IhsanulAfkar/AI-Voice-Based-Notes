'use client'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNote } from '@/hooks/useNote'
import { TSession } from '@/types'
import { DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu'
import { EllipsisVertical, Trash } from 'lucide-react'
import { NextPage } from 'next'
import TipTapEditor from './TipTapEditor'
import { htmlToMarkdown } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
  session: TSession | null,
  conversationId: string
}
const NoteSection: NextPage<Props> = ({ session, conversationId }) => {
  const { data, refetch, isFetched } = useNote(conversationId)
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/conversation/${conversationId}/note`, {
        method: "DELETE"
      })
      if (!response.ok) {
        toast.error('Failed delete notes')
        return
      }
      const body = await response.json()
      toast.success(body.message ?? 'success')
      refetch()
    } catch (error) {
      toast.error('Server Error')
    }
  }
  const handleSave = async (html: string) => {
    try {
      const response = await fetch(`/api/conversation/${conversationId}/note`, {
        method: "PUT",
        body: JSON.stringify({
          content: html
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        toast.error('Failed post notes')
        return
      }
    } catch (error) {
      toast.error('Server Error')
    }
  }
  return <div className='flex-none w-full max-w-xs sticky top-0 self-start'>
    <div className='flex justify-between items-center gap-4 mb-4'>
      <p className='font-semibold text-xl'>
        My Note
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='hover:cursor-pointer mr-4 '>
          <EllipsisVertical width={16} height={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align="end">
          <DropdownMenuItem variant='destructive' className='hover:cursor-pointer' onClick={e => handleDelete()}>
            <Trash />
            Clear Note
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className='max-h-[80vh] overflow-y-auto rounded-md bg-[#E5E6EA] border'>
      <TipTapEditor content={data?.content ?? ''} saveData={handleSave} />
    </div>
  </div>
}

export default NoteSection