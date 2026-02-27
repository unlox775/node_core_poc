import { Module } from '@nestjs/common';
import { DealsModule } from './deals/deals.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    PrismaModule,
    DealsModule,
    // AdminJS v7 is ESM-only; use dynamic import for NestJS (CommonJS)
    // @ts-expect-error - @adminjs/nestjs requires moduleResolution node16; Nest uses commonjs
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: (prisma: PrismaService) => {
          const AdminJS = require('adminjs');
          const { Database, Resource, getModelByName } = require('@adminjs/prisma');
          AdminJS.registerAdapter({ Database, Resource });
          return {
            adminJsOptions: {
              rootPath: '/admin',
              resources: [
                { resource: { model: getModelByName('Deal'), client: prisma }, options: {} },
                { resource: { model: getModelByName('AdminUser'), client: prisma }, options: {} },
              ],
            },
            auth: {
              authenticate: async (email: string, password: string) => {
                const bcrypt = require('bcryptjs');
                const adminUser = await prisma.adminUser.findUnique({ where: { username: email } });
                if (!adminUser || !(await bcrypt.compare(password, adminUser.password))) return null;
                return { ...adminUser, email: adminUser.username };
              },
              cookieName: 'adminjs',
              cookiePassword: process.env.SESSION_SECRET || 'demo-secret-change-in-production',
            },
            sessionOptions: {
              resave: true,
              saveUninitialized: true,
              secret: process.env.SESSION_SECRET || 'demo-secret-change-in-production',
              cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
              name: 'adminjs',
            },
          };
        },
        inject: [PrismaService],
      }),
    ),
  ],
})
export class AppModule {}
