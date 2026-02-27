import { z } from "zod";
import * as bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const admin = await ctx.db.adminUser.findUnique({ where: { username: input.username } });
      if (!admin) return { success: false as const };
      const valid = await bcrypt.compare(input.password, admin.password);
      return { success: valid, adminId: valid ? admin.id : null };
    }),
});
