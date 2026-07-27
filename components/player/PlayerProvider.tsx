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
import { usePathname } from "next/navigation";
import type { Mix } from "@/lib/mixes";
import { track } from "@/lib/analytics";
import { NowPlayingBar } from "./NowPlayingBar";

// One media element for the whole site, driven imperatively so the play() call
// stays inside the user's click gesture (browsers block autoplay otherwise).
// The provider lives in the root layout, so a mix keeps playing as the visitor
// navigates between the home page and /mixes pages.
//
// It's a <video>, not an <audio>, purely to satisfy the autoplay policy: Chrome
// rejects muted <audio> autoplay with NotAllowedError but exempts muted
// <video>, which is what lets a mix start silently on arrival. An MP3 has no
// video track, so this is an audio player wearing a different tag — the
// HTMLMediaElement API driving it is identical either way.

type PlayerContextValue = {
  current: Mix | null;
  isPlaying: boolean;
  /** True between hitting play and the stream producing audio. */
  isLoading: boolean;
  currentTime: number;
  duration: number;
  /** True only for the silent arrival autoplay, until the visitor asks for sound. */
  isMuted: boolean;
  /** Play the mix, or pause/resume it if it's already the active one. */
  toggle: (mix: Mix) => void;
  seek: (seconds: number) => void;
  /** Turn the sound on (and start playback if the muted autoplay was blocked). */
  unmute: () => void;
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
// Lives in a ref (not state) so the once-bound media listeners can read it.
type MixTracking = {
  mix: Mix;
  playSent: boolean;
  completeSent: boolean;
  /** Progress milestones (25/50/75) already reported, each fired at most once. */
  milestones: Set<number>;
  /** Auto-started rather than clicked — reported so GA can separate the two. */
  auto: boolean;
};

export function PlayerProvider({
  queue = [],
  autoStart = false,
  children,
}: {
  /** All mixes in display order — when one ends, the next in this list plays. */
  queue?: Mix[];
  /** Start a random mix from the queue, muted, on every home-page load. */
  autoStart?: boolean;
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLVideoElement | null>(null);
  const trackingRef = useRef<MixTracking | null>(null);
  // The route the visitor actually landed on, pinned at first render so a later
  // client-side navigation can't retroactively trigger the autostart.
  const landingPath = useRef(usePathname()).current;
  // Ref so the once-bound `ended` listener always sees the current queue.
  const queueRef = useRef(queue);
  const [current, setCurrent] = useState<Mix | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const startMix = useCallback(
    (mix: Mix, opts?: { auto?: boolean; muted?: boolean }) => {
      const audio = audioRef.current;
      if (!audio) return;
      setCurrent(mix);
      trackingRef.current = {
        mix,
        playSent: false,
        completeSent: false,
        milestones: new Set(),
        auto: opts?.auto ?? false,
      };
      setCurrentTime(0);
      // Seed the scrubber range from the feed's duration before metadata loads.
      setDuration(mix.durationSeconds || 0);
      setIsLoading(true);
      // Only the arrival autoplay passes `muted`. Auto-advance leaves it alone,
      // so a mix the visitor turned the sound on for doesn't go silent at the
      // track change.
      if (opts?.muted !== undefined) {
        audio.muted = opts.muted;
        setIsMuted(opts.muted);
      }
      audio.src = mix.streamUrl;
      void audio.play().catch(() => setIsLoading(false));
    },
    [],
  );

  const toggle = useCallback(
    (mix: Mix) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Reaching for a play button is an explicit ask for sound — never leave
      // the visitor tapping play on a still-muted element.
      audio.muted = false;
      setIsMuted(false);

      if (current?.id === mix.id) {
        if (audio.paused) void audio.play().catch(() => {});
        else audio.pause();
        return;
      }

      startMix(mix);
    },
    [current, startMix],
  );

  // Runs inside the visitor's click, which is what makes the unmute stick:
  // flipping `muted` off without a gesture gets the playback paused instead.
  const unmute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    setIsMuted(false);
    if (audio.paused) void audio.play().catch(() => {});
  }, []);

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
    if (audio) audio.muted = false;
    setIsMuted(false);
  }, []);

  // Start a random mix on arrival, muted. Browsers block autoplay that makes
  // noise, but allow it silently — so the mix genuinely runs and the bar offers
  // a "Tap for sound" control. That tap is the user gesture the browser wants,
  // which is why unmuting from it works where an automatic unmute would not.
  //
  // Home page only. Someone landing on /mixes/<slug> came for *that* mix, and
  // cueing a random other one over it would be the wrong thing entirely.
  useEffect(() => {
    if (!autoStart || queue.length === 0 || landingPath !== "/") return;
    startMix(queue[Math.floor(Math.random() * queue.length)], {
      auto: true,
      muted: true,
    });
    // Mount only — every fresh load of the home page starts a new random mix.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setIsPlaying(true);
      const t = trackingRef.current;
      if (t && !t.playSent) {
        t.playSent = true;
        // `play_source` keeps auto-started listens from inflating the
        // click-through funnel — filter to "click" in GA for chosen plays.
        track("mix_play", {
          mix_title: t.mix.title,
          mix_slug: t.mix.slug,
          play_source: t.auto ? "auto" : "click",
        });
      }
    };
    const onPause = () => setIsPlaying(false);
    const onPlaying = () => setIsLoading(false);
    const onWaiting = () => setIsLoading(true);
    // Backstop: keeps the flag honest if anything mutes the element outside
    // the callbacks above (a browser control, an extension).
    const onVolume = () => setIsMuted(audio.muted);
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
      // Auto-advance to the next mix in display order. The shared media
      // element was unlocked by the original click, so play() is allowed here.
      const queue = queueRef.current;
      const i = t ? queue.findIndex((m) => m.id === t.mix.id) : -1;
      const next = i >= 0 ? queue[i + 1] : undefined;
      // Auto-advance isn't a chosen play either, so it carries the same flag.
      if (next) startMix(next, { auto: true });
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("volumechange", onVolume);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("volumechange", onVolume);
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
    () => ({
      current,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      isMuted,
      toggle,
      seek,
      unmute,
      dismiss,
    }),
    [
      current,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      isMuted,
      toggle,
      seek,
      unmute,
      dismiss,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* Off-screen rather than display:none — a hidden media element is
          fair game for the browser to throttle. playsInline keeps iOS from
          hijacking it into the fullscreen video player. */}
      <video
        ref={audioRef}
        preload="none"
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      <NowPlayingBar />
    </PlayerContext.Provider>
  );
}
