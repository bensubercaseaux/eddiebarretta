"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Mix } from "@/lib/mixes";
import { NowPlayingBar } from "./NowPlayingBar";

// One <audio> element for the whole site, driven imperatively so the play()
// call stays inside the user's click gesture (browsers block autoplay
// otherwise). The provider lives in the root layout, so a mix keeps playing
// as the visitor navigates between the home page and /mixes pages.

type PlayerContextValue = {
  current: Mix | null;
  isPlaying: boolean;
  /** True between hitting play and the stream producing audio. */
  isLoading: boolean;
  currentTime: number;
  duration: number;
  /** Play the mix, or pause/resume it if it's already the active one. */
  toggle: (mix: Mix) => void;
  seek: (seconds: number) => void;
  /** Stop playback and hide the now-playing bar. */
  dismiss: () => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within <PlayerProvider>");
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Mix | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = useCallback(
    (mix: Mix) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (current?.id === mix.id) {
        if (audio.paused) void audio.play().catch(() => {});
        else audio.pause();
        return;
      }

      setCurrent(mix);
      setCurrentTime(0);
      // Seed the scrubber range from the feed's duration before metadata loads.
      setDuration(mix.durationSeconds || 0);
      setIsLoading(true);
      audio.src = mix.streamUrl;
      void audio.play().catch(() => setIsLoading(false));
    },
    [current],
  );

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }, []);

  const dismiss = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setCurrent(null);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onPlaying = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  // Keep the fixed bar from covering the footer while a mix is loaded.
  useEffect(() => {
    document.body.style.paddingBottom = current ? "5.25rem" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [current]);

  const value = useMemo(
    () => ({ current, isPlaying, isLoading, currentTime, duration, toggle, seek, dismiss }),
    [current, isPlaying, isLoading, currentTime, duration, toggle, seek, dismiss],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="none" />
      <NowPlayingBar />
    </PlayerContext.Provider>
  );
}
