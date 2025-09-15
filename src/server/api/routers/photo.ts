import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const photoRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ url: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        return ctx.db.photo.create({
          data: {
            url: input.url,
          },
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
});
