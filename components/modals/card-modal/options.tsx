import { FormChecklist } from '@/components/form/form-checklist'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface OptionsProps {
  cardId: string
  boardId: string
}

export const Options = ({ cardId, boardId }: OptionsProps) => {
  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Options</p>
      <FormChecklist cardId={cardId} boardId={boardId}>
        <Button size="inline" variant="gray" className="w-full justify-start">
          <Plus className="h-4 w-4" />
          <span>Añadir checklist</span>
        </Button>
      </FormChecklist>
    </div>
  )
}
