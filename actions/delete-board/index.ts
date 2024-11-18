'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { DeleteBoard } from './schema'
import { redirect } from 'next/navigation'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth()

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { id } = data

  try {
    await db.board.delete({
      where: {
        id,
        orgId
      }
    })
  } catch (error) {
    return {
      error: 'Filed to delete board'
    }
  }
  revalidatePath(`/organization/${orgId}`)
  redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeActions(DeleteBoard, handler)
