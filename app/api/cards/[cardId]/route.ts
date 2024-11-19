import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  context: { params: Promise<{ cardId: string }> }
) {
  try {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { params } = context
    const card = await db.card.findUnique({
      where: {
        id: (await params).cardId,
        list: {
          board: {
            orgId
          }
        }
      },
      include: {
        list: {
          select: {
            title: true
          }
        }
      }
    })
    return NextResponse.json(card)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
