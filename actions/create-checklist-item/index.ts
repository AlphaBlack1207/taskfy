'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { CreateChecklistItem } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'No autorizado'
    }
  }

  const { title, checklistId, boardId } = data
  let checklistItem

  try {
    const checklist = await db.checklist.findUnique({
      where: {
        id: checklistId,
        card: {
          list: {
            board: {
              orgId
            }
          }
        }
      }
    })

    if (!checklist) {
      return {
        error: 'Checklist no encontrado'
      }
    }

    const lastItem = await db.checklistItem.findFirst({
      where: { checklistId },
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const newOrder = lastItem ? lastItem.order + 1 : 1

    checklistItem = await db.checklistItem.create({
      data: {
        title,
        checklistId,
        order: newOrder
      }
    })

    await createAuditLog({
      entityTitle: checklistItem.title,
      entityId: checklistItem.id,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      action: ACTION.CREATE
    })
  } catch (error) {
    return {
      error: 'Error al crear el item de la lista de verificación'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: checklistItem }
}

export const createChecklistItem = createSafeActions(
  CreateChecklistItem,
  handler
)
