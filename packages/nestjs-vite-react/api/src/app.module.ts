import { Module } from '@nestjs/common';
import { DealsModule } from './deals/deals.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, DealsModule, AdminModule],
})
export class AppModule {}
