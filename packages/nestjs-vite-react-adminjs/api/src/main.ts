import 'dotenv/config';
import { compare as bcryptCompare } from 'bcryptjs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });

  const prisma = app.get(PrismaService);
  // AdminJS v7 is ESM-only; use Function to avoid tsc converting import() to require()
  const AdminJS = (await new Function('return import("adminjs")')()).default;
  const { Database, Resource, getModelByName } = await new Function('return import("@adminjs/prisma")')();
  const AdminJSExpress = (await new Function('return import("@adminjs/express")')()).default;

  AdminJS.registerAdapter({ Database, Resource });
  const admin = new AdminJS({
    resources: [
      { resource: { model: getModelByName('Deal'), client: prisma }, options: {} },
      { resource: { model: getModelByName('AdminUser'), client: prisma }, options: {} },
    ],
  });
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email: string, password: string) => {
        const adminUser = await prisma.adminUser.findUnique({ where: { username: email } });
        if (!adminUser || !(await bcryptCompare(password, adminUser.password))) return null;
        return { ...adminUser, email: adminUser.username };
      },
      cookieName: 'adminjs',
      cookiePassword: process.env.SESSION_SECRET || 'demo-secret-change-in-production',
    },
    null,
    {
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET || 'demo-secret-change-in-production',
      cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
      name: 'adminjs',
    },
  );
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use(admin.options.rootPath, adminRouter);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
