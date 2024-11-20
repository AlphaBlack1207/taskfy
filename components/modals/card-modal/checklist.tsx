'use client'

import { Button } from '@/components/ui/button'
import { ListCheck, Trash2 } from 'lucide-react'
import { useAction } from '@/hooks/use-action'
import { deleteChecklist } from '@/actions/delete-checklist'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { FormInput } from '@/components/form/form-input'
import { ElementRef, useRef, useState } from 'react'
import { updateChecklist } from '@/actions/update-checklist'
import { ChecklistWithCard } from '@/types'
import { useQueryClient } from '@tanstack/react-query'

interface ChecklistProps {
  data: ChecklistWithCard[]
}

export const ChecklistUI = ({ data }: ChecklistProps) => {
  if (!data.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No hay checklists para mostrar
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {data.map(checklist => (
        <ChecklistItem key={checklist.id} data={checklist} />
      ))}
    </div>
  )
}

interface ChecklistItemProps {
  data: ChecklistWithCard
}

const ChecklistItem = ({ data }: ChecklistItemProps) => {
  const params = useParams()
  const queryClient = useQueryClient()
  const inputRef = useRef<ElementRef<'input'>>(null)
  const [title, setTitle] = useState(data.title)

  const { execute: executeDelete, isLoading } = useAction(deleteChecklist, {
    onSuccess: () => {
      toast.success('Checklist eliminada')
      queryClient.invalidateQueries({
        queryKey: ['checklists', data.cardId]
      })
    },
    onError: error => {
      toast.error(error)
    }
  })

  const { execute: executeUpdate } = useAction(updateChecklist, {
    onSuccess: data => {
      toast.success(`Renamed checklist to ${data.title}`)
      setTitle(data.title)
    },
    onError: error => {
      toast.error(error)
    }
  })

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit()
  }

  const onDelete = () => {
    executeDelete({
      id: data.id,
      boardId: params.boardId as string
    })
  }

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string
    const boardId = params.boardId as string

    if (title === data.title) return

    executeUpdate({ id: data.id, boardId, title })
  }

  return (
    <div className="flex items-start gap-x-3 w-full">
      <ListCheck className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit} className="flex-1 px-[2px]">
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -lef-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
      </div>
      <Button
        onClick={onDelete}
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className="text-neutral-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

ChecklistUI.Skeleton = function ChecklistSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-x-3">
        <div className="w-full">
          <div className="h-6 w-24 bg-neutral-200 rounded-sm" />
        </div>
        <div className="h-6 w-6 bg-neutral-200 rounded-sm" />
      </div>
    </div>
  )
}
