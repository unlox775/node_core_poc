import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async login(username: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { username } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return { success: false };
    }
    return { success: true };
  }
}
