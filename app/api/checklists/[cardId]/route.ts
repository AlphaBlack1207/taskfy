import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
      return new NextResponse('No autorizado', { status: 401 })
    }

    const checklists = await db.checklist.findMany({
      where: {
        cardId: params.cardId,
        card: {
          list: {
            board: {
              orgId
            }
          }
        }
      },
      include: {
        items: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json(checklists)
  } catch (error) {
    return new NextResponse('Error interno', { status: 500 })
  }
}
