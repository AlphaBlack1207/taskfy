'use client'

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useAction } from '@/hooks/use-action'
import { createChecklist } from '@/actions/create-checklist'
import { FormInput } from './form-input'
import { FormSubmit } from './form-button'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { ElementRef, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

interface FormChecklistProps {
  children: React.ReactNode
  cardId: string
  boardId: string
  side?: 'left' | 'right' | 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export const FormChecklist = ({
  children,
  cardId,
  boardId,
  side = 'bottom',
  align,
  sideOffset = 0
}: FormChecklistProps) => {
  const params = useParams()
  const closeRef = useRef<ElementRef<'button'>>(null)
  const queryClient = useQueryClient()

  const { execute, fieldErrors } = useAction(createChecklist, {
    onSuccess: data => {
      toast.success('Checklist creado exitosamente')
      closeRef.current?.click()
      queryClient.invalidateQueries({
        queryKey: ['checklists', cardId]
      })
    },
    onError: error => {
      toast.error(error)
    }
  })

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    const boardID = params.boardId as string

    execute({ title, cardId, boardId: boardID })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="text-sm font-medium text-center text-neutral-600">
          Añadir checklist
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormInput
              id="title"
              label="Título"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Añadir</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  )
}
