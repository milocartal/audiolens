
# Audiolens

> Application Next.js pour associer des photos et des enregistrements audio, avec transcription automatique.

## Présentation

Audiolens permet de prendre ou importer une photo, d’enregistrer un commentaire audio associé, puis de visualiser et écouter les prises de vue. L’application propose aussi la transcription automatique des fichiers audio.

## Fonctionnalités principales

- Upload de photos (prise de vue ou galerie)
- Enregistrement audio (microphone)
- Association photo/audio et visualisation
- Transcription automatique de l’audio (OpenAI Whisper)
- Interface moderne (React, Tailwind CSS)

## Structure du projet

- `src/pages/` : pages Next.js (`index.tsx`, `new.tsx`, API...)
- `src/components/` : composants React (audio, photo)
- `prisma/` : base de données (SQLite, Prisma)
- `public/` : fichiers statiques (photos, audios)

## Technologies utilisées

- Next.js 14
- React 18
- Prisma (ORM, SQLite)
- tRPC (API typesafe)
- Tailwind CSS
- ffmpeg-static (conversion audio)
- OpenAI Whisper (transcription)

## Installation

1. **Cloner le dépôt**

  ```bash
  git clone <repo-url>
  cd audiolens
  ```

2. **Installer les dépendances**

  ```bash
  pnpm install
  # ou npm install
  ```

3. **Configurer la base de données**

  ```bash
  pnpm db:generate
  # ou npx prisma migrate dev
  ```

4. **Lancer le serveur de développement**

  ```bash
  pnpm dev
  # ou npm run dev
  ```

## Commandes utiles

- `pnpm dev` : démarre le serveur Next.js en mode développement
- `pnpm build` : build de l’application
- `pnpm start` : démarre le serveur en production
- `pnpm db:studio` : ouvre Prisma Studio (visualisation DB)
- `pnpm db:generate` : migration Prisma

## API & Backend

- Upload audio : `POST /api/audio/upload`
- Upload photo : `POST /api/photo/upload`
- Transcription : `POST /api/transcript`

## Modèle de données (Prisma)

```prisma
model Photo {
  id        String   @id @default(cuid())
  url       String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  Response  Response[]
}

model Audio {
  id        String   @id @default(cuid())
  url       String
  duration  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  Response  Response[]
}

model Response {
  id      String @id @default(cuid())
  photoId String
  photo   Photo  @relation(fields: [photoId], references: [id], onDelete: Cascade)
  audioId String
  audio   Audio  @relation(fields: [audioId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

## Déploiement

Compatible Vercel, Netlify, Docker. Adapter la variable d’environnement `DATABASE_URL` selon l’environnement.

---

**Auteur :** milocartal
