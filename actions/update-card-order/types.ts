import { z } from 'zod'
import { UpdateCardOrder } from './schema'
import { ActionState } from '@/lib/create-safe-actions'
import { Card } from '@prisma/client'

export type InputType = z.infer<typeof UpdateCardOrder>
export type ReturnType = ActionState<InputType, Card[]>
