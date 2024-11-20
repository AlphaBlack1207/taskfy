'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { UpdateChecklistItemOrder } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'No autorizado'
    }
  }

  const { items, boardId } = data
  let updatedItems

  try {
    const transaction = items.map(item =>
      db.checklistItem.update({
        where: {
          id: item.id,
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
          order: item.order,
          checklistId: item.checklistId
        }
      })
    )

    updatedItems = await db.$transaction(transaction)
  } catch (error) {
    return {
      error: 'Error al reordenar los items'
    }
  }

  revalidatePath(`/board/${boardId}`)
  return { data: updatedItems }
}

export const updateChecklistItemOrder = createSafeActions(
  UpdateChecklistItemOrder,
  handler
)
