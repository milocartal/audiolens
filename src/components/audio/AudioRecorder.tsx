import React, { useState, useRef, useEffect } from "react";
import { Wave } from "./Wave";
import { RefreshCcw } from "lucide-react";
import { formatTime } from "~/utils/utils";

interface AudioRecorderProps {
  setAudioURL: React.Dispatch<React.SetStateAction<string>>;
  audioURL: string;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  time: number;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob[]>>;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  audioURL,
  setAudioURL,
  setTime,
  time,
  setAudioBlob,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder>();
  const audioChunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();
  const animationFrameIdRef = useRef<number>();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isRecording && seconds !== 0) {
      if (interval !== null) {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval as unknown as number);
  }, [isRecording, seconds]);

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Media Devices API not supported in this browser");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    audioContextRef.current = new AudioContext();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    source.connect(analyserRef.current);

    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    const drawWave = () => {
      if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current)
        return;

      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext("2d");
      if (!canvasCtx) return;

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "#fff";
      canvasCtx.beginPath();

      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i]! / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

      animationFrameIdRef.current = requestAnimationFrame(drawWave);
    };

    drawWave();

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      audioChunksRef.current = [];
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
      cancelAnimationFrame(animationFrameIdRef.current!);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (!mediaRecorderRef.current) {
      return;
    }

    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());

    mediaRecorderRef.current.stop();
    setIsRecording(false);

    setTime(seconds + 1);

    setAudioBlob(audioChunksRef.current);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2 className="w-full text-center text-2xl font-semibold tracking-tight">
        {!isRecording
          ? audioURL
            ? ""
            : "Lancez l'enregistrement"
          : formatTime(seconds)}
      </h2>

      {audioURL && isRecording === false ? (
        <div className="w-full">
          <audio ref={audioRef} src={audioURL} hidden />
          <Wave audioUrl={audioURL} height={200} totalTime={time} control>
            <button
              onClick={() => {
                setAudioURL("");
                setSeconds(0);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white outline outline-2 outline-offset-2 outline-white"
            >
              <RefreshCcw className="h-5 w-5" />
            </button>
          </Wave>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            height="200"
            style={{
              background: "black",
              width: "100%",
            }}
          />
          <div className="my-2 flex w-full items-center justify-center">
            {isRecording ? (
              <button
                onClick={handleStopRecording}
                className="flex h-12 w-12 items-center justify-center rounded-full outline outline-2 outline-offset-2 outline-white"
              >
                <div className="h-5 w-5 rounded-sm bg-red-500"></div>
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                className="h-12 w-12 rounded-full bg-red-500 outline outline-2 outline-offset-2 outline-white"
              ></button>
            )}
          </div>
        </>
      )}

      {audioURL && <div className="w-full"></div>}
    </div>
  );
};
