import { Card, Checklist, List } from '@prisma/client'

export type ListWithCards = List & { cards: Card[] }
export type CardWithList = Card & { list: List }

export type CardWithChecklists = Card & { checklists: Checklist[] }
export type ChecklistWithCard = Checklist & { card: Card }
