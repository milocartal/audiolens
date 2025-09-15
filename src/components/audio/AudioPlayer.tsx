import { CirclePlay, CircleStop } from "lucide-react";
import React, { useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, className }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function play() {
    if (audioRef.current) {
      setIsPlaying(true);
      void audioRef.current.play();
    }
  }

  function stop() {
    if (audioRef.current) {
      setIsPlaying(false);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <button onClick={isPlaying ? stop : play}>
      {isPlaying ? (
        <CircleStop className={`h-10 w-10 ${className}`} />
      ) : (
        <CirclePlay className={`h-10 w-10 ${className}`} />
      )}
      <audio
        ref={audioRef}
        controls
        className="hidden"
        onEnded={handleAudioEnded}
      >
        <source src={src} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </button>
  );
};
