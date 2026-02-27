import { db } from 'api/src/lib/db'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

export const deals: QueryResolvers['deals'] = () => {
  return db.deal.findMany({ orderBy: { createdAt: 'desc' } })
}

export const createDeal: MutationResolvers['createDeal'] = ({ input }) => {
  return db.deal.create({ data: { ...input, status: 'pending' } })
}

export const updateDeal: MutationResolvers['updateDeal'] = ({ id, input }) => {
  return db.deal.update({ where: { id }, data: input })
}

export const deleteDeal: MutationResolvers['deleteDeal'] = ({ id }) => {
  return db.deal.delete({ where: { id } })
}
