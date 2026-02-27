import { Module } from '@nestjs/common';
import { DealsModule } from './deals/deals.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, DealsModule],
})
export class AppModule {}
