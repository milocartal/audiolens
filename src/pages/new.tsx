import Head from "next/head";
import Image from "next/image";

import { Check, CloudUpload } from "lucide-react";

import { type NextPage } from "next";

import React, { useEffect, useState } from "react";
import { PhotoPicker } from "~/components/photo/PhotoPicker";
import { AudioRecorder } from "~/components/audio/AudioRecorder";
import { useRouter } from "next/router";
import { LittleWave } from "~/components/audio/Wave";
import { api } from "~/utils/api";

const NewPhoto: NextPage = () => {
  const router = useRouter();
  const [state, setState] = useState(0);

  const [image, setImage] = useState<string>("/photos/placeholder.png");
  const [audioURL, setAudioURL] = useState("");
  const [time, setTime] = useState(0);

  const [audioBlob, setAudioBlob] = useState<Blob[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const [file, setFile] = useState<File>();

  const createAudio = api.audio.create.useMutation();

  const createPhoto = api.photo.create.useMutation();

  const createReponse = api.reponse.create.useMutation({
    onSuccess: () => {
      void router.push("/");
    },
  });

  useEffect(() => {
    // Fonction pour gérer l'événement de retour
    const handlePopState = () => {
      setState((prev) => prev - 1);
      if (state <= 0) {
        void router.push("/");
      }
      // Change l'état customState
    };

    // Ajouter l'écouteur d'événement pour les changements d'historique
    window.addEventListener("popstate", handlePopState);

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [state, router]);

  const handleToggleState = () => {
    setState(state + 1);
    // Pousser une nouvelle entrée dans l'historique
    window.history.pushState(null, "", window.location.pathname);
  };

  async function handleSubmit() {
    setIsUploading(true);
    const audioFormData = new FormData();
    const photoFormData = new FormData();
    console.log(file);
    if (!audioBlob || audioBlob.length === 0 || file === undefined) {
      setIsUploading(false);
      alert("Veuillez enregistrer une prise de vue et une photo");
      return;
    }

    audioFormData.append("file", audioBlob[0]!);
    const reqAudio = await fetch("/api/audio/upload", {
      method: "POST",
      body: audioFormData,
    });

    if (!reqAudio.ok) {
      setIsUploading(false);
      return;
    }

    photoFormData.append("file", file);
    const reqPhoto = await fetch("/api/photo/upload", {
      method: "POST",
      body: photoFormData,
    });

    if (!reqPhoto.ok) {
      setIsUploading(false);
      return;
    }

    const image = (await reqPhoto.json()) as {
      message: string;
      filePath: string;
    };

    const audioData = (await reqAudio.json()) as {
      message: string;
      filePath: string;
    };

    const audio = await createAudio.mutateAsync({
      url: audioData.filePath,
      time: time,
    });

    const photo = await createPhoto.mutateAsync({
      url: image.filePath,
    });

    if (!audio || !photo) {
      setIsUploading(false);
      return;
    }

    await createReponse.mutateAsync({
      audioId: audio.id,
      photoId: photo.id,
    });

    setIsUploading(false);

    return;
  }

  const Header: React.FC = () => {
    switch (state) {
      case 0:
        return (
          <header className="mb-4 mt-8">
            <h1 className="text-4xl font-bold tracking-tight text-white ">
              Prenez une photo
            </h1>
            <p className="mt-2 text-gray-400">
              Prenez une photo qui vous inspire
            </p>
          </header>
        );
      case 1:
        return (
          <header className="mb-4 mt-8">
            <h1 className="text-4xl font-bold tracking-tight text-white ">
              Expliquez
            </h1>
            <p className="mt-2 text-gray-400">
              Dites à haute voix ce que vous pensez
            </p>
          </header>
        );
      case 2:
        return (
          <header className="mb-4 mt-8">
            <h1 className="text-4xl font-bold tracking-tight text-white ">
              Validez
            </h1>
            <p className="mt-2 text-gray-400">
              Vérifiez ce que vous avez enregistré
            </p>
          </header>
        );
      default:
        return (
          <header className="mb-4 mt-8">
            <h1 className="text-4xl font-bold tracking-tight text-white ">
              Oups
            </h1>
            <p className="mt-2 text-gray-400">
              Mais qu&apos;est ce que vous faites là ?
            </p>
          </header>
        );
    }
  };

  const TheBody: React.FC = () => {
    switch (state) {
      case 0:
        return (
          <PhotoPicker setFile={setFile} image={image} setImage={setImage} />
        );
      case 1:
        return (
          <AudioRecorder
            audioURL={audioURL}
            setAudioURL={setAudioURL}
            time={time}
            setTime={setTime}
            setAudioBlob={setAudioBlob}
          />
        );
      case 2:
        return (
          <div className="flex h-full w-full flex-col gap-4">
            <h2 className="mt-4 w-full text-left text-2xl font-semibold tracking-tight">
              Votre photo
            </h2>
            <Image
              loader={() => image}
              src={image}
              alt="Photo"
              width={300}
              height={300}
              className="h-52 w-full object-cover"
            />

            <h2 className="mt-4 w-full text-left text-2xl font-semibold tracking-tight">
              Votre commentaire
            </h2>
            <LittleWave audioUrl={audioURL} height={50} totalTime={time} />
          </div>
        );
      default:
        return (
          <div className="flex h-full w-full flex-col justify-center gap-4">
            <p>Un problème est survenu, vous allez redirectionner sous peu.</p>
            <p>
              Si ce n&apos;est pas le cas, appuyez sur le bouton si dessous{" "}
            </p>
          </div>
        );
    }
  };

  const Footer: React.FC = () => {
    switch (state) {
      case 0:
        return (
          <button
            onClick={handleToggleState}
            disabled={state === 0 && image === "/photos/placeholder.png"}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-white py-3 font-bold text-black disabled:opacity-50"
          >
            <Check className="h-6 w-6" />
            Valider
          </button>
        );
      case 1:
        return (
          <button
            onClick={handleToggleState}
            disabled={state === 1 && audioURL === ""}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-white py-3 font-bold text-black disabled:opacity-50"
          >
            <Check className="h-6 w-6" />
            Valider
          </button>
        );
      case 2:
        return (
          <button
            onClick={handleSubmit}
            disabled={
              image === "/photos/placeholder.png" ||
              audioURL === "" ||
              isUploading
            }
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-green-500 py-3 font-bold text-black disabled:opacity-50"
          >
            <CloudUpload className="h-6 w-6" />
            Envoyer
          </button>
        );
      default:
        return (
          <button
            onClick={async () => await router.push("/")}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-white py-3 font-bold text-black disabled:opacity-50"
          >
            Retour à l&apos;accueil
          </button>
        );
    }
  };

  return (
    <>
      <Head>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full w-full flex-col items-start justify-start gap-2 p-6 sm:w-4/12">
        <Header />
        <TheBody />
        <Footer />
      </main>
    </>
  );
};

export default NewPhoto;
