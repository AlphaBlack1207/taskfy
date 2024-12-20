'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { UpdateCard } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId, ...values } = data
  let card

  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      },
      data: {
        ...values
      }
    })

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.UPDATE
    })
  } catch (error) {
    return {
      error: 'Filed to update board'
    }
  }
  revalidatePath(`/board/${boardId}`)
  return { data: card }
}

export const updateCard = createSafeActions(UpdateCard, handler)
