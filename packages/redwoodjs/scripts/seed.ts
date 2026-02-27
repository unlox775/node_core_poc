import { db } from 'api/src/lib/db'
import * as bcrypt from 'bcryptjs'

export default async () => {
  const hashedPassword = await bcrypt.hash('123qwe', 10)
  await db.adminUser.upsert({
    where: { username: 'ethan' },
    update: {},
    create: { username: 'ethan', password: hashedPassword },
  })

  const count = await db.deal.count()
  if (count === 0) {
    await db.deal.create({
      data: {
        name: "Bob's Pianos",
        description: 'Need the new piano moved on March 31st at 8pm',
        address: '123 Main Street, Saratoga Springs, UT',
        status: 'pending',
      },
    })
    await db.deal.create({
      data: {
        name: 'Bob Jones — Roof Trusses',
        description: 'New roof trusses for his new house',
        address: '456 Oak Avenue, Provo, UT',
        status: 'pending',
      },
    })
  }
  console.log('Seed completed.')
}
