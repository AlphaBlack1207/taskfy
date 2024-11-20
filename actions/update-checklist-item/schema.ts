import { z } from 'zod'

export const UpdateChecklistItem = z.object({
  id: z.string(),
  boardId: z.string(),
  title: z.optional(
    z
      .string({
        required_error: 'Título es requerido',
        invalid_type_error: 'Título es requerido'
      })
      .min(1, {
        message: 'Título es requerido'
      })
  ),
  isCompleted: z.optional(z.boolean())
})
