'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCardModal } from '@/hooks/use-card-modal'
import { fetcher } from '@/lib/fetcher'
import { CardWithList, ChecklistWithCard } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { Header } from './header'
import { Description } from './description'
import { Actions } from './actions'
import { AuditLog } from '@prisma/client'
import { Activity } from './activity'
import { Options } from './options'
import { ChecklistUI } from './checklist'

export const CardModal = () => {
  const id = useCardModal(state => state.id)
  const isOpen = useCardModal(state => state.isOpen)
  const onClose = useCardModal(state => state.onClose)

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`)
  })

  const { data: checklistData } = useQuery<ChecklistWithCard[]>({
    queryKey: ['checklists', id],
    queryFn: () => fetcher(`/api/checklists/${id}`)
  })

  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`)
  })

  console.log('Card:', cardData)
  console.log('Checklist:', checklistData)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        </DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
              {!checklistData ? (
                <ChecklistUI.Skeleton />
              ) : (
                <ChecklistUI data={checklistData} />
              )}
              {!auditLogsData ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditLogsData} />
              )}
            </div>
          </div>
          <div className="col-span-1 space-y-6">
            {cardData && (
              <Options cardId={cardData.id} boardId={cardData.list.boardId} />
            )}
            {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
