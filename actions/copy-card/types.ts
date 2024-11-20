import { z } from 'zod'
import { CopyCard } from './schema'
import { ActionState } from '@/lib/create-safe-actions'
import { Card } from '@prisma/client'

export type InputType = z.infer<typeof CopyCard>
export type ReturnType = ActionState<InputType, Card>
