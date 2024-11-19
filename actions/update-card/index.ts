'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { UpdateCard } from './schema'

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
  } catch (error) {
    return {
      error: 'Filed to update board'
    }
  }
  revalidatePath(`/board/${boardId}`)
  return { data: card }
}

export const updateCard = createSafeActions(UpdateCard, handler)