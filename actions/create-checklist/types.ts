import { z } from 'zod'
import { Checklist } from '@prisma/client'
import { ActionState } from '@/lib/create-safe-actions'
import { CreateChecklist } from './schema'

export type InputType = z.infer<typeof CreateChecklist>
export type ReturnType = ActionState<InputType, Checklist>
