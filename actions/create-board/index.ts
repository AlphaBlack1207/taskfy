'use server'

import { auth } from '@clerk/nextjs/server'
import { InputType, ReturnType } from './types'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { createSafeActions } from '@/lib/create-safe-actions'
import { CreateBoard } from './schema'

const handler = async (data: InputType): Promise<ReturnType> => {
  console.log('Creating board:', data)
  const { userId } = await auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const { title } = data

  let board

  try {
    board = await db.board.create({
      data: {
        title
      }
    })
  } catch (error) {
    return {
      error: 'Failed to create'
    }
  }

  revalidatePath(`/board/${board.id}`)
  return { data: board }
}

export const createBoard = createSafeActions(CreateBoard, handler)
