import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { BoardNavbar } from './_components/board-navbar'

export async function generateMetadata(
  props: {
    params: Promise<{ boardId: string }>
  }
) {
  const params = await props.params;
  const { orgId } = await auth()

  if (!orgId) {
    return {
      title: 'Board'
    }
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId
    }
  })

  return {
    title: board?.title || 'Board'
  }
}

const BpardIdLayout = async (
  props: {
    children: React.ReactNode
    params: Promise<{ boardId: string }>
  }
) => {
  const params = await props.params;

  const {
    children
  } = props;

  const { orgId } = await auth()

  if (!orgId) {
    redirect('/select-org')
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId
    }
  })

  if (!board) {
    notFound()
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  )
}

export default BpardIdLayout
