import { z } from 'zod'

export const CreateBoard = z.object({
  title: z
    .string({
      required_error: 'Please enter a title',
      invalid_type_error: 'Title is required'
    })
    .min(3, {
      message: 'Title is too short'
    })
})
