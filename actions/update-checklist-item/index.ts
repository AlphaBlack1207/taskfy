'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { UpdateChecklistItem } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'No autorizado'
    }
  }

  const { id, boardId, ...values } = data
  let checklistItem

  try {
    checklistItem = await db.checklistItem.update({
      where: {
        id,
        checklist: {
          card: {
            list: {
              board: {
                orgId
              }
            }
          }
        }
      },
      data: {
        ...values
      }
    })

    await createAuditLog({
      entityTitle: checklistItem.title,
      entityId: checklistItem.id,
      entityType: ENTITY_TYPE.CHECKLIST_ITEM,
      action: ACTION.UPDATE
    })
  } catch (error) {
    return {
      error: 'Error al actualizar el item'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: checklistItem }
}

export const updateChecklistItem = createSafeActions(
  UpdateChecklistItem,
  handler
)
