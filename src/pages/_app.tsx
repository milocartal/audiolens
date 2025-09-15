import { GeistSans } from "geist/font/sans";
import { type AppProps, type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Audiolens</title>
        <meta
          name="description"
          content="Audiolens, des audios mais que pour les gens de Lens"
        />
        <link rel="shortcut icon" href="/logo-audiolens.png" />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/logo-audiolens.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/logo-audiolens.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/logo-audiolens.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/logo-audiolensa.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AudioLens" />
        <meta
          property="og:description"
          content="Audiolens, des audios mais que pour les gens de Lens"
        />
        <meta property="og:site_name" content="Audiolens" />
        <meta property="og:url" content="https://www.audiolens.io" />
        <meta property="og:image" content="/icons/og.png" />
      </Head>
      <main
        className={`${GeistSans.className} flex h-screen w-full items-center justify-center bg-black text-white`}
      >
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
