import { z } from 'zod'
import { ChecklistItem } from '@prisma/client'
import { ActionState } from '@/lib/create-safe-actions'
import { UpdateChecklistItemOrder } from './schema'

export type InputType = z.infer<typeof UpdateChecklistItemOrder>
export type ReturnType = ActionState<InputType, ChecklistItem[]>
