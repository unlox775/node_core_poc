import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dealRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.deal.findMany({ orderBy: { createdAt: "desc" } })
  ),

  create: publicProcedure
    .input(z.object({ name: z.string(), description: z.string(), address: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.deal.create({ data: { ...input, status: "pending" } })
    ),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      address: z.string().optional(),
      status: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.deal.update({ where: { id }, data });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => ctx.db.deal.delete({ where: { id: input.id } })),
});
