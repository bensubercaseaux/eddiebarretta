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
import { track } from "@/lib/analytics";
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

// GA listening funnel for the active mix, mirroring GA4's video milestones.
// Lives in a ref (not state) so the once-bound <audio> listeners can read it.
type MixTracking = {
  mix: Mix;
  playSent: boolean;
  completeSent: boolean;
  /** Progress milestones (25/50/75) already reported, each fired at most once. */
  milestones: Set<number>;
};

export function PlayerProvider({
  queue = [],
  children,
}: {
  /** All mixes in display order — when one ends, the next in this list plays. */
  queue?: Mix[];
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackingRef = useRef<MixTracking | null>(null);
  // Ref so the once-bound `ended` listener always sees the current queue.
  const queueRef = useRef(queue);
  const [current, setCurrent] = useState<Mix | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const startMix = useCallback((mix: Mix) => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrent(mix);
    trackingRef.current = {
      mix,
      playSent: false,
      completeSent: false,
      milestones: new Set(),
    };
    setCurrentTime(0);
    // Seed the scrubber range from the feed's duration before metadata loads.
    setDuration(mix.durationSeconds || 0);
    setIsLoading(true);
    audio.src = mix.streamUrl;
    void audio.play().catch(() => setIsLoading(false));
  }, []);

  const toggle = useCallback(
    (mix: Mix) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (current?.id === mix.id) {
        if (audio.paused) void audio.play().catch(() => {});
        else audio.pause();
        return;
      }

      startMix(mix);
    },
    [current, startMix],
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

    const onPlay = () => {
      setIsPlaying(true);
      const t = trackingRef.current;
      if (t && !t.playSent) {
        t.playSent = true;
        track("mix_play", { mix_title: t.mix.title, mix_slug: t.mix.slug });
      }
    };
    const onPause = () => setIsPlaying(false);
    const onPlaying = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      const t = trackingRef.current;
      if (t && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        for (const milestone of [25, 50, 75]) {
          if (pct >= milestone && !t.milestones.has(milestone)) {
            t.milestones.add(milestone);
            track("mix_progress", {
              mix_title: t.mix.title,
              mix_slug: t.mix.slug,
              percent: milestone,
            });
          }
        }
      }
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      const t = trackingRef.current;
      if (t && !t.completeSent) {
        t.completeSent = true;
        track("mix_complete", { mix_title: t.mix.title, mix_slug: t.mix.slug });
      }
      // Auto-advance to the next mix in display order. The shared <audio>
      // element was unlocked by the original click, so play() is allowed here.
      const queue = queueRef.current;
      const i = t ? queue.findIndex((m) => m.id === t.mix.id) : -1;
      const next = i >= 0 ? queue[i + 1] : undefined;
      if (next) startMix(next);
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
  }, [startMix]);

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
