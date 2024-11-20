import { z } from 'zod'

export const CreateChecklist = z.object({
  title: z
    .string({
      required_error: 'Título es requerido',
      invalid_type_error: 'Título es requerido'
    })
    .min(1, {
      message: 'Título es requerido'
    }),
  cardId: z.string(),
  boardId: z.string()
})
