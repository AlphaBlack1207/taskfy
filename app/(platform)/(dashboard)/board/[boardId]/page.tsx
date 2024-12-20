import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ListContainer } from './_components/list-container'

interface BoardIdPageProps {
  params: Promise<{
    boardId: string
  }>
}

const BoardIdPage = async (props: BoardIdPageProps) => {
  const params = await props.params;
  const { orgId } = await auth()

  if (!orgId) {
    redirect('/select-org')
  }

  const list = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: {
        orgId
      }
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  })

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={params.boardId} data={list} />
    </div>
  )
}
export default BoardIdPage
