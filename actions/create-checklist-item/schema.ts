import { z } from 'zod'

export const CreateChecklistItem = z.object({
  title: z
    .string({
      required_error: 'Título es requerido',
      invalid_type_error: 'Título es requerido'
    })
    .min(1, {
      message: 'Título es requerido'
    }),
  checklistId: z.string(),
  boardId: z.string()
})
