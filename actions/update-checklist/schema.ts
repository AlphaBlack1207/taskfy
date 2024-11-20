import { z } from 'zod'

export const UpdateChecklist = z.object({
  id: z.string(),
  boardId: z.string(),
  title: z
    .string({
      required_error: 'Título es requerido',
      invalid_type_error: 'Título es requerido'
    })
    .min(1, {
      message: 'Título es requerido'
    })
})
