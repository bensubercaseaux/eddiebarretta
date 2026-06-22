"use client";

import { useMemo, useState, useTransition } from "react";
import { validateHandlesAction, autoResolveAction } from "./actions";

type Status = "idle" | "checking" | "valid" | "invalid";
type Artist = {
  name: string;
  handle: string;
  status: Status;
  displayName?: string;
  followers?: number | null;
};
type Track = { title: string; artists: Artist[] };

function fmtFollowers(n: number | null | undefined): string {
  if (n == null) return "";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}

const field =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-fg placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

// Best-effort split: artists are the trailing segment after the last ) or ] in
// the line. No bracket → whole line is the title (artists left for you to fill).
function parseLine(line: string): Track {
  const close = Math.max(line.lastIndexOf(")"), line.lastIndexOf("]"));
  let title = line;
  let rest = "";
  if (close >= 0 && close < line.length - 1) {
    title = line.slice(0, close + 1).trim();
    rest = line.slice(close + 1).trim();
  }
  const artists = rest
    ? rest
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((name) => ({ name, handle: "", status: "idle" as Status }))
    : [];
  return { title, artists };
}

function buildOutput(tracks: Track[]): string {
  return tracks
    .map((t) => {
      const seg = t.artists
        .map((a) =>
          a.status === "valid" && a.handle ? `${a.name} [@${a.handle}]` : a.name,
        )
        .join(", ");
      return seg ? `${t.title} ${seg}` : t.title;
    })
    .join("\n");
}

export function TracklistTool() {
  const [raw, setRaw] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [minFollowers, setMinFollowers] = useState(500);
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => buildOutput(tracks), [tracks]);
  const validCount = useMemo(
    () => tracks.flatMap((t) => t.artists).filter((a) => a.status === "valid").length,
    [tracks],
  );
  const totalArtists = useMemo(
    () => tracks.flatMap((t) => t.artists).length,
    [tracks],
  );

  function parse() {
    const next = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map(parseLine);
    setTracks(next);
  }

  function setArtist(ti: number, ai: number, patch: Partial<Artist>) {
    setTracks((prev) =>
      prev.map((t, i) =>
        i !== ti
          ? t
          : {
              ...t,
              artists: t.artists.map((a, j) => (j === ai ? { ...a, ...patch } : a)),
            },
      ),
    );
  }

  function setTitle(ti: number, title: string) {
    setTracks((prev) => prev.map((t, i) => (i === ti ? { ...t, title } : t)));
  }

  function addArtist(ti: number) {
    setTracks((prev) =>
      prev.map((t, i) =>
        i === ti
          ? { ...t, artists: [...t.artists, { name: "", handle: "", status: "idle" }] }
          : t,
      ),
    );
  }

  function removeArtist(ti: number, ai: number) {
    setTracks((prev) =>
      prev.map((t, i) =>
        i === ti ? { ...t, artists: t.artists.filter((_, j) => j !== ai) } : t,
      ),
    );
  }

  function autoResolve() {
    const names = Array.from(
      new Set(
        tracks.flatMap((t) => t.artists.map((a) => a.name.trim())).filter(Boolean),
      ),
    );
    if (!names.length) return;
    startTransition(async () => {
      const results = await autoResolveAction(names, minFollowers);
      const map = new Map(names.map((n, i) => [n, results[i]]));
      setTracks((prev) =>
        prev.map((t) => ({
          ...t,
          artists: t.artists.map((a) => {
            const r = map.get(a.name.trim());
            return r && r.status === "valid"
              ? {
                  ...a,
                  handle: r.handle,
                  status: "valid",
                  displayName: r.name,
                  followers: r.followers,
                }
              : a;
          }),
        })),
      );
    });
  }

  function validateAll() {
    const jobs: { ti: number; ai: number; handle: string }[] = [];
    tracks.forEach((t, ti) =>
      t.artists.forEach((a, ai) => {
        if (a.handle.trim()) jobs.push({ ti, ai, handle: a.handle.trim() });
      }),
    );
    if (!jobs.length) return;
    setTracks((prev) =>
      prev.map((t, ti) => ({
        ...t,
        artists: t.artists.map((a, ai) =>
          jobs.some((j) => j.ti === ti && j.ai === ai) ? { ...a, status: "checking" } : a,
        ),
      })),
    );
    startTransition(async () => {
      const results = await validateHandlesAction(jobs.map((j) => j.handle));
      setTracks((prev) => {
        const next = prev.map((t) => ({ ...t, artists: t.artists.map((a) => ({ ...a })) }));
        jobs.forEach((j, k) => {
          const r = results[k];
          const a = next[j.ti].artists[j.ai];
          if (r.status === "valid") {
            a.status = "valid";
            a.handle = r.handle;
            a.displayName = r.name;
            a.followers = r.followers;
          } else {
            a.status = "invalid";
            a.displayName = undefined;
            a.followers = undefined;
          }
        });
        return next;
      });
    });
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the textarea is selectable as a fallback */
    }
  }

  return (
    <div className="grid gap-8">
      {/* Paste */}
      <section>
        <label htmlFor="raw" className="text-sm font-medium text-fg">
          Paste a tracklist
        </label>
        <p className="mt-1 text-sm text-muted">
          One track per line, e.g. <code>Damn Good (Original Mix) Dark Heart</code>.
          Artists are read from the end of each line — fix any mis-splits below.
        </p>
        <textarea
          id="raw"
          rows={8}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={`${field} mt-3 font-mono`}
          placeholder={"Too Much To Handle (Original Mix) Roel\nDamn Good (Original Mix) Dark Heart"}
        />
        <button
          type="button"
          onClick={parse}
          className="mt-3 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-transform hover:bg-accent-bright active:scale-[0.98]"
        >
          Parse {tracks.length > 0 ? "again" : "tracklist"}
        </button>
      </section>

      {tracks.length > 0 && (
        <>
          {/* Toolbar */}
          <section className="flex flex-wrap items-center gap-3 border-y border-line py-4">
            <button
              type="button"
              onClick={autoResolve}
              disabled={pending}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright disabled:opacity-60"
            >
              {pending ? "Working…" : "Auto-resolve handles"}
            </button>
            <button
              type="button"
              onClick={validateAll}
              disabled={pending}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright disabled:opacity-60"
            >
              {pending ? "Working…" : "Validate all handles"}
            </button>
            <label className="flex items-center gap-2 text-sm text-faint">
              Min followers
              <input
                type="number"
                min={0}
                step={50}
                value={minFollowers}
                onChange={(e) => setMinFollowers(Math.max(0, Number(e.target.value) || 0))}
                className="w-24 rounded-lg border border-line bg-ink px-2 py-1 text-fg focus:border-accent focus:outline-none"
              />
            </label>
            <span className="ml-auto text-sm text-faint">
              {validCount}/{totalArtists} artists linked
            </span>
          </section>

          {/* Rows */}
          <section className="grid gap-4">
            {tracks.map((t, ti) => (
              <div
                key={ti}
                className="rounded-[14px] border border-line bg-surface/40 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 shrink-0 text-right text-sm tabular-nums text-faint">
                    {ti + 1}
                  </span>
                  <input
                    value={t.title}
                    onChange={(e) => setTitle(ti, e.target.value)}
                    className={field}
                    aria-label={`Track ${ti + 1} title`}
                  />
                </div>

                <div className="mt-3 grid gap-2 pl-9">
                  {t.artists.map((a, ai) => (
                    <div key={ai} className="flex flex-wrap items-center gap-2">
                      <input
                        value={a.name}
                        onChange={(e) => setArtist(ti, ai, { name: e.target.value })}
                        className={`${field} max-w-[14rem]`}
                        placeholder="Artist name"
                        aria-label="Artist name"
                      />
                      <div className="flex items-center gap-1.5">
                        <span className="text-faint">@</span>
                        <input
                          value={a.handle}
                          onChange={(e) =>
                            setArtist(ti, ai, {
                              handle: e.target.value,
                              status: "idle",
                              displayName: undefined,
                            })
                          }
                          className={`${field} max-w-[12rem]`}
                          placeholder="soundcloud-handle"
                          aria-label="SoundCloud handle"
                        />
                      </div>
                      <StatusBadge artist={a} />
                      <button
                        type="button"
                        onClick={() => removeArtist(ti, ai)}
                        className="ml-auto text-faint transition-colors hover:text-red-300"
                        aria-label="Remove artist"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArtist(ti)}
                    className="justify-self-start text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
                  >
                    + Add artist
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Output */}
          <section>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-fg">Annotated tracklist</h2>
              <button
                type="button"
                onClick={copyOutput}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-transform hover:bg-accent-bright active:scale-[0.98]"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <p className="mt-1 text-sm text-faint">
              Only validated handles are appended — unconfirmed artists stay as plain
              text, so you never paste a dead link.
            </p>
            <textarea
              readOnly
              rows={Math.min(Math.max(tracks.length, 4), 24)}
              value={output}
              className={`${field} mt-3 font-mono`}
            />
          </section>
        </>
      )}
    </div>
  );
}

function StatusBadge({ artist }: { artist: Artist }) {
  if (artist.status === "checking")
    return <span className="text-xs text-faint">checking…</span>;
  if (artist.status === "valid")
    return (
      <span className="text-xs text-emerald-400">
        ✓ {artist.displayName || "found"}
        {artist.followers != null && (
          <span className="text-faint"> · {fmtFollowers(artist.followers)}</span>
        )}
      </span>
    );
  if (artist.status === "invalid")
    return <span className="text-xs text-red-300">✗ not found</span>;
  return null;
}
