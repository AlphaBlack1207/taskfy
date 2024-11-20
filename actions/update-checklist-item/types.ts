import { z } from 'zod'
import { ChecklistItem } from '@prisma/client'
import { ActionState } from '@/lib/create-safe-actions'
import { UpdateChecklistItem } from './schema'

export type InputType = z.infer<typeof UpdateChecklistItem>
export type ReturnType = ActionState<InputType, ChecklistItem>
