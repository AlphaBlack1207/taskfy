import { create } from 'zustand'

interface CardModalState {
  id?: string
  isOpen: boolean
  onOpen: (id: string) => void
  onClose: () => void
}

export const useCardModal = create<CardModalState>(set => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => {
    set({ isOpen: true, id })
  },
  onClose: () => {
    set({ isOpen: false, id: undefined })
  }
}))
