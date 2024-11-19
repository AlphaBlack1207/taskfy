'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { DeleteList } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id, boardId } = data
  let list

  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId
        }
      }
    })
  } catch (error) {
    return {
      error: 'Filed to delete'
    }
  }
  revalidatePath(`/organization/${boardId}`)
  return { data: list }
}

export const deleteList = createSafeActions(DeleteList, handler)
