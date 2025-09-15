import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const audioRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ url: z.string().min(1), time: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return ctx.db.audio.create({
          data: {
            url: input.url,
            duration: input.time,
          },
        });
      } catch (error) {
        console.error(error);
        return null;
      }
    }),
});
