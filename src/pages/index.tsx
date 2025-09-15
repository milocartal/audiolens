import Head from "next/head";
import Link from "next/link";

import { CirclePlus } from "lucide-react";

import { db } from "~/server/db";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import { type ResponseWithAll } from "~/utils/types";
import Image from "next/image";

import { format } from "date-fns";
import { AudioPlayer } from "~/components/audio/AudioPlayer";

import { fr } from "date-fns/locale";
import { formatTime } from "~/utils/utils";

export const getServerSideProps: GetServerSideProps<{
  views: ResponseWithAll[];
}> = async function () {
  const views = await db.response.findMany({
    orderBy: { createdAt: "desc" },
    include: { photo: true, audio: true },
  });

  return {
    props: { views: JSON.parse(JSON.stringify(views)) as ResponseWithAll[] },
  };
};

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ views }) => {
  return (
    <>
      <Head>
        <title>Vos prises de vue</title>
        <meta
          name="description"
          content="Explorer les prises de vue que vous avez effectuées"
        />
      </Head>
      <main className="flex h-full w-full flex-col items-start justify-start p-6 sm:w-4/12">
        <header className="my-8">
          <h1 className="text-4xl font-bold tracking-tight text-white ">
            Prise de vue
          </h1>
          <p className="mt-2 text-gray-400">
            Enregistrez vos prises de vue et vos émotions
          </p>
        </header>
        <h2 className="text-2xl font-semibold tracking-tight text-white ">
          Votre historique
        </h2>
        <div className="flex h-full w-full flex-col gap-2 overflow-y-auto py-4">
          {views.length > 0 ? (
            views.map((view) => {
              const { photo, audio } = view;
              return (
                <div
                  key={view.id}
                  className="flex w-full items-center justify-between gap-4"
                >
                  <Image
                    loader={() => photo.url}
                    src={photo.url}
                    alt={`Photo du ${format(view.createdAt, "dd/MM/yyyy")}`}
                    width={100}
                    height={100}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                  <div className="w-auto">
                    <h3 className="text-lg">
                      {format(view.createdAt, "PPP", { locale: fr })} -{" "}
                      {format(view.createdAt, "HH:mm", { locale: fr }).replace(
                        ":",
                        "h",
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {audio.duration > 60
                        ? `${formatTime(audio.duration)} minutes`
                        : `${audio.duration} secondes`}
                    </p>
                  </div>

                  <AudioPlayer src={audio.url} className="h-10 w-10" />
                </div>
              );
            })
          ) : (
            <p>Aucune prise de vue effectuée</p>
          )}
        </div>

        <Link
          href="/new"
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-white py-3 font-bold text-black"
        >
          <CirclePlus className="h-6 w-6" />
          Ajouter
        </Link>
      </main>
    </>
  );
};

export default Home;
