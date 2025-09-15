import { createTRPCRouter } from "~/server/api/trpc";
import { audioRouter } from "./routers/audio";
import { photoRouter } from "./routers/photo";
import { reponseRouter } from "./routers/reponse";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  audio: audioRouter,
  photo: photoRouter,
  reponse: reponseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
