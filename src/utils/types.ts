import { type Prisma } from "@prisma/client";

export type ResponseWithAll = Prisma.ResponseGetPayload<{
  include: {
    photo: true;
    audio: true;
  };
}>;
