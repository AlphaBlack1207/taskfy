'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { UpdateListOrder } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { items, boardId } = data
  let lists

  try {
    const transaction = items.map(list =>
      db.list.update({
        where: {
          id: list.id,
          board: {
            orgId
          }
        },
        data: {
          order: list.order
        }
      })
    )

    lists = await db.$transaction(transaction)
  } catch (error) {
    return {
      error: 'Filed to reorder'
    }
  }
  revalidatePath(`/board/${boardId}`)
  return { data: lists }
}

export const updateListOrder = createSafeActions(UpdateListOrder, handler)
