import { Injectable } from '@nestjs/common';
import { DealStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.deal.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(data: { name: string; description: string; address: string }) {
    return this.prisma.deal.create({ data: { ...data, status: DealStatus.pending } });
  }

  update(id: string, data: { name?: string; description?: string; address?: string; status?: DealStatus }) {
    return this.prisma.deal.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.deal.delete({ where: { id } });
  }
}
