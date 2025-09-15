// pages/api/transcribe.ts

import { type NextApiRequest, type NextApiResponse } from "next";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { env } from "~/env";
import ffmpegPath from "ffmpeg-static";

//const ffmpegPath = require("ffmpeg-static");

function convertOpusToWav(
  inputFile: string,
  outputFile: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath} -i ${inputFile} ${outputFile}`,
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        resolve();
      },
    );
  });
}
async function transcribeAudio(audioFilePath: string) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("API key for OpenAI is missing");
  }

  const form = {
    file: fs.createReadStream(audioFilePath),
    model: "whisper-1",
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        method: "POST",
        body: JSON.stringify(form),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(response);
    return await response.text();
  } catch (error) {
    console.error("Error during transcription:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { inputFile } = req.body as { inputFile: string };
  const outputFile = path.join(process.cwd(), "public", "converted_file.wav");

  try {
    await convertOpusToWav(inputFile, outputFile);
    const transcription = await transcribeAudio(outputFile);
    res.status(200).json(transcription);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
}
