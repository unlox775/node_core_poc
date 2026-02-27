import * as bcrypt from 'bcryptjs'
import { db } from 'api/src/lib/db'
import type { MutationResolvers } from 'types/graphql'

export const adminLogin: MutationResolvers['adminLogin'] = async ({
  username,
  password,
}) => {
  const admin = await db.adminUser.findUnique({ where: { username } })
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return { success: false }
  }
  return { success: true }
}
