// pages/api/audio/upload.ts
import { type Fields, type Files, type File, IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { type NextApiRequest, type NextApiResponse } from "next";
import { customRandom, random, urlAlphabet } from "nanoid";

export const config = {
  api: {
    bodyParser: false, // Désactiver le body parser par défaut
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const nanoid = customRandom(urlAlphabet, 16, random);
    const name = nanoid() + ".opus";

    const uploadDir = path.join(process.cwd(), "public", "audios");
    const form = new IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      allowEmptyFiles: true,
    });

    form.parse(req, (err: Error, fields: Fields, files: Files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error parsing the file" });
      }

      const file = files.file![0] as File;
      const oldPath = file.filepath;
      const newPath = path.join(uploadDir, name);

      fs.rename(oldPath, newPath, (err: Error | null) => {
        if (err) {
          return res.status(500).json({ error: "Error saving the file" });
        }

        return res.status(200).json({
          message: "File uploaded successfully",
          filePath: "/audios/" + name,
        });
      });
    });
    form.on("error", (err: Error) => {
      console.error(err);
      return res.status(500).json({ error: "Error parsing the file" });
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
