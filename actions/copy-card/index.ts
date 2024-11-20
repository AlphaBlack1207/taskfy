'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

import { db } from '@/lib/db'
import { createAuditLog } from '@/lib/create-audit-log'
import { createSafeActions } from '@/lib/create-safe-actions'

import { CopyCard } from './schema'
import { InputType, ReturnType } from './types'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId } = data
  let card

  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      }
    })
    if (!cardToCopy) {
      return {
        error: 'Card not found'
      }
    }

    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId },
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const newOrder = lastCard ? lastCard.order + 1 : 1

    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        listId: cardToCopy.listId,
        order: newOrder
      }
    })

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE
    })
  } catch (error) {
    return {
      error: 'Filed to copy'
    }
  }
  revalidatePath(`/organization/${boardId}`)
  return { data: card }
}

export const copyCard = createSafeActions(CopyCard, handler)
