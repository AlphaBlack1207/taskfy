import { auth, currentUser } from '@clerk/nextjs/server'
import { ACTION, ENTITY_TYPE } from '@prisma/client'
import { db } from './db'

interface Props {
  entityId: string
  entityType: ENTITY_TYPE
  entityTitle: string
  action: ACTION
}

export const createAuditLog = async (props: Props) => {
  try {
    const { orgId } = await auth()
    const user = await currentUser()

    if (!orgId || !user) {
      return new Error('Unauthorized')
    }

    const { entityId, entityType, entityTitle, action } = props

    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + ' ' + user?.lastName
      }
    })
  } catch (error) {
    return new Error('Failed to create audit log')
  }
}
