import { useCallback, useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import { CirclePlay, CircleStop, Pause, Play } from "lucide-react";
import { formatTime } from "~/utils/utils";

interface WaveProps {
  audioUrl: string;
  height: number;
  totalTime: number;
  control?: boolean;
  children?: React.ReactNode;
}

export const Wave: React.FC<WaveProps> = function ({
  audioUrl,
  height,
  totalTime,
  control = true,
  children,
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    waveColor: "#fff",
    progressColor: "rgb(96, 96, 96)",
    cursorColor: "#fff",
    height: height,
    barWidth: 7,
    barGap: 5,
    barRadius: 30,
    fillParent: true,
    normalize: true,
    url: audioUrl,
    interact: control,
    cursorWidth: control === false ? 0 : 2,
  });

  const onPlayPause = useCallback(async () => {
    await wavesurfer?.playPause();
  }, [wavesurfer]);

  return (
    <>
      {control && (
        <div className="flex w-full items-center justify-between py-4">
          <p className="text-2xl font-semibold tracking-tight">
            {formatTime(currentTime)}
          </p>
          <p className="text-2xl font-semibold tracking-tight">
            {formatTime(totalTime)}
          </p>
        </div>
      )}

      <div ref={containerRef} className="py-10" />

      {control && (
        <div className="flex w-full items-center justify-center gap-6">
          <button
            onClick={onPlayPause}
            className="flex h-12 w-12 items-center justify-center rounded-full outline outline-2 outline-offset-2 outline-white"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          {children}
        </div>
      )}
    </>
  );
};

export const LittleWave: React.FC<WaveProps> = function ({
  audioUrl,
  height,
  totalTime,
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    waveColor: "#fff",
    progressColor: "rgb(96, 96, 96)",
    cursorColor: "#fff",
    height: height,
    barWidth: 7,
    barGap: 5,
    barRadius: 30,
    fillParent: true,
    normalize: true,
    url: audioUrl,
  });

  const onPlayPause = useCallback(async () => {
    await wavesurfer?.playPause();
  }, [wavesurfer]);

  return (
    <>
      <div className="flex w-full items-center justify-start gap-4">
        <button onClick={onPlayPause} className="">
          {isPlaying ? (
            <CircleStop className={`h-10 w-10`} />
          ) : (
            <CirclePlay className={`h-10 w-10`} />
          )}
        </button>
        <p>
          {isPlaying ? formatTime(currentTime) : formatTime(totalTime)} minutes
        </p>
      </div>

      <div ref={containerRef} className="" />
    </>
  );
};
