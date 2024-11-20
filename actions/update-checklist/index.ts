'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { UpdateChecklist } from './schema'
import { createAuditLog } from '@/lib/create-audit-log'
import { ACTION, ENTITY_TYPE } from '@prisma/client'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'No autorizado'
    }
  }

  const { id, boardId, title } = data
  let checklist

  try {
    checklist = await db.checklist.update({
      where: {
        id,
        card: {
          list: {
            board: {
              orgId
            }
          }
        }
      },
      data: {
        title
      }
    })

    await createAuditLog({
      entityTitle: checklist.title,
      entityId: checklist.id,
      entityType: ENTITY_TYPE.CHECKLIST,
      action: ACTION.UPDATE
    })
  } catch (error) {
    return {
      error: 'Error al actualizar la lista de verificación'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: checklist }
}

export const updateChecklist = createSafeActions(UpdateChecklist, handler)
