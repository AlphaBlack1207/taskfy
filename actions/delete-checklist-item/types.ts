import { z } from 'zod'
import { ChecklistItem } from '@prisma/client'
import { ActionState } from '@/lib/create-safe-actions'
import { DeleteChecklistItem } from './schema'

export type InputType = z.infer<typeof DeleteChecklistItem>
export type ReturnType = ActionState<InputType, ChecklistItem>
