import "dotenv/config";
import express from "express";
import cors from "cors";
import * as bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

async function bootstrap() {
  // AdminJS v7 is ESM-only; dynamic import avoids tsx/require resolution issues
  const AdminJS = (await new Function('return import("adminjs")')()).default;
  const { Database, Resource, getModelByName } = await new Function('return import("@adminjs/prisma")')();
  const AdminJSExpress = (await new Function('return import("@adminjs/express")')()).default;

  AdminJS.registerAdapter({ Database, Resource });

  const admin = new AdminJS({
    resources: [
      { resource: { model: getModelByName("Deal"), client: prisma }, options: {} },
      { resource: { model: getModelByName("AdminUser"), client: prisma }, options: {} },
    ],
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email: string, password: string) => {
        const adminUser = await prisma.adminUser.findUnique({ where: { username: email } });
        if (!adminUser || !(await bcrypt.compare(password, adminUser.password))) return null;
        return adminUser;
      },
      cookieName: "adminjs",
      cookiePassword: process.env.SESSION_SECRET || "demo-secret-change-in-production",
    },
    null,
    {
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET || "demo-secret-change-in-production",
      cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
      name: "adminjs",
    }
  );

  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use(admin.options.rootPath, adminRouter);

  // PUBLIC: Submit new deal (anyone can submit)
  app.post("/api/deals", async (req: express.Request, res: express.Response) => {
    const { name, description, address } = req.body;
    const deal = await prisma.deal.create({ data: { name, description, address, status: "pending" } });
    res.json(deal);
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API on http://localhost:${PORT}`);
    console.log(`AdminJS at http://localhost:${PORT}${admin.options.rootPath} (login: ethan / 123qwe)`);
  });
}

bootstrap();
