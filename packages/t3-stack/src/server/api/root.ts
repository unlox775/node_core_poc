import { createTRPCRouter } from "~/server/api/trpc";
import { dealRouter } from "~/server/api/routers/deal";
import { adminRouter } from "~/server/api/routers/admin";

export const appRouter = createTRPCRouter({
  deal: dealRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
