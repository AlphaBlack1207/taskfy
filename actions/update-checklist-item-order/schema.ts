import { z } from 'zod'

export const UpdateChecklistItemOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      checklistId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date()
    })
  ),
  boardId: z.string()
})
