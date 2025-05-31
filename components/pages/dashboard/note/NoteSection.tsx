import { TSession } from '@/types'
import { NextPage } from 'next'

interface Props {
  session: TSession | null
}
const NoteSection: NextPage<Props> = ({ session }) => {
  return <div className='flex-none w-full max-w-xs sticky top-0 self-start'>
    Notes
  </div>
}

export default NoteSection