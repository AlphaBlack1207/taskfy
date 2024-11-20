'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { CreateChecklist } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'No autorizado'
    }
  }

  const { title, cardId, boardId } = data
  let checklist

  try {
    const card = await db.card.findUnique({
      where: {
        id: cardId,
        list: {
          board: {
            orgId
          }
        }
      }
    })

    if (!card) {
      return {
        error: 'Tarjeta no encontrada'
      }
    }

    checklist = await db.checklist.create({
      data: {
        title,
        cardId
      }
    })

    await createAuditLog({
      entityTitle: checklist.title,
      entityId: checklist.id,
      entityType: ENTITY_TYPE.CHECKLIST,
      action: ACTION.CREATE
    })
  } catch (error) {
    return {
      error: 'Error al crear la lista de verificación'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: checklist }
}

export const createChecklist = createSafeActions(CreateChecklist, handler)
