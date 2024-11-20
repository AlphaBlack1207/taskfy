import { z } from 'zod'
import { Checklist } from '@prisma/client'
import { ActionState } from '@/lib/create-safe-actions'
import { UpdateChecklist } from './schema'

export type InputType = z.infer<typeof UpdateChecklist>
export type ReturnType = ActionState<InputType, Checklist>
