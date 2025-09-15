import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const reponseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ photoId: z.string().min(1), audioId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.response.create({
        data: {
          photoId: input.photoId,
          audioId: input.audioId,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.db.response.delete({
        where: { id: input.id },
      });
    }),
});
