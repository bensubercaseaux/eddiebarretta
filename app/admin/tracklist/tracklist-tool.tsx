"use client";

import { useMemo, useRef, useState } from "react";
import { resolveArtistAction, validateHandleAction } from "./actions";

type Status = "idle" | "checking" | "valid" | "invalid";
type Artist = {
  name: string;
  handle: string;
  status: Status;
  displayName?: string;
  followers?: number | null;
};
type Track = { title: string; artists: Artist[] };
type Lookup = Awaited<ReturnType<typeof resolveArtistAction>>;

// "&" is ambiguous in dance music: "Aly & Fila" is one act, "Ferry Corsten &
// Markus Schulz" is two. So names are never split on "&" at parse time — only
// as a resolve fallback, when the combined name fails to match on SoundCloud.
function ampParts(name: string): string[] {
  return name
    .split(/\s*&\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function artistFromLookup(name: string, r: Lookup): Artist {
  return r.status === "valid"
    ? {
        name,
        handle: r.handle,
        status: "valid",
        displayName: r.name,
        followers: r.followers,
      }
    : { name, handle: "", status: "idle" };
}

function fmtFollowers(n: number | null | undefined): string {
  if (n == null) return "";
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}

const field =
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-fg placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

// Split a line into its title column and artist column. Most exports separate
// the two with a tab (or a wide space gap), which is reliable even when an
// artist name itself ends in parens — e.g. "Kide (IT)", "REVOL(ofc)". Fall back
// to "after the last ) or ]" for single-space-separated lines.
function splitTitleArtists(line: string): { title: string; artistStr: string } {
  const tab = line.indexOf("\t");
  if (tab >= 0) return { title: line.slice(0, tab), artistStr: line.slice(tab + 1) };

  const gap = line.match(/\s{3,}/);
  if (gap && gap.index !== undefined)
    return {
      title: line.slice(0, gap.index),
      artistStr: line.slice(gap.index + gap[0].length),
    };

  const close = Math.max(line.lastIndexOf(")"), line.lastIndexOf("]"));
  if (close >= 0 && close < line.length - 1)
    return { title: line.slice(0, close + 1), artistStr: line.slice(close + 1) };

  return { title: line, artistStr: "" };
}

function parseLine(line: string): Track {
  const { title, artistStr } = splitTitleArtists(line);
  const artists = artistStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name) => ({ name, handle: "", status: "idle" as Status }));
  return { title: title.trim().replace(/\s{2,}/g, " "), artists };
}

function buildOutput(tracks: Track[], bullets: boolean): string {
  return tracks
    .map((t) => {
      const seg = t.artists
        .map((a) =>
          a.status === "valid" && a.handle ? `${a.name} [@${a.handle}]` : a.name,
        )
        .join(", ");
      const line = seg ? `${t.title} ${seg}` : t.title;
      // A leading "• " keeps each track on its own visual line on Apple/Amazon/
      // YouTube, which collapse plain newlines. The site strips it back out.
      return bullets ? `• ${line}` : line;
    })
    .join("\n");
}

export function TracklistTool() {
  const [raw, setRaw] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [minFollowers, setMinFollowers] = useState(500);
  const [delaySec, setDelaySec] = useState(3);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(
    null,
  );
  const cancelRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const [copiedLinks, setCopiedLinks] = useState(false);
  const [bullets, setBullets] = useState(true);

  const output = useMemo(() => buildOutput(tracks, bullets), [tracks, bullets]);
  const validCount = useMemo(
    () => tracks.flatMap((t) => t.artists).filter((a) => a.status === "valid").length,
    [tracks],
  );
  const totalArtists = useMemo(
    () => tracks.flatMap((t) => t.artists).length,
    [tracks],
  );
  const followList = useMemo(() => {
    const map = new Map<
      string,
      { handle: string; name: string; followers?: number | null }
    >();
    for (const t of tracks)
      for (const a of t.artists)
        if (a.status === "valid" && a.handle && !map.has(a.handle))
          map.set(a.handle, {
            handle: a.handle,
            name: a.displayName || a.name,
            followers: a.followers,
          });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tracks]);

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

  function stop() {
    cancelRef.current = true;
  }

  // Jittered wait so the cadence isn't perfectly regular.
  function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms + Math.random() * ms * 0.3));
  }

  function patchByName(name: string, patch: Partial<Artist>) {
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        artists: t.artists.map((a) =>
          a.name.trim() === name ? { ...a, ...patch } : a,
        ),
      })),
    );
  }

  // Swap every occurrence of a combined name ("A & B") for its resolved parts.
  function replaceByName(name: string, replacements: Artist[]) {
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        artists: t.artists.flatMap((a) =>
          a.name.trim() === name ? replacements.map((r) => ({ ...r })) : [a],
        ),
      })),
    );
  }

  // Resolve one unique artist name at a time, pausing `delaySec` between calls
  // so we never burst requests at SoundCloud.
  async function autoResolve() {
    if (running) return;
    const names = Array.from(
      new Set(
        tracks.flatMap((t) => t.artists.map((a) => a.name.trim())).filter(Boolean),
      ),
    );
    if (!names.length) return;

    setRunning(true);
    cancelRef.current = false;
    const gap = Math.max(0, delaySec) * 1000;
    // Results seen this run, so a name that appears both solo and as half of an
    // "A & B" collab costs one API call, not two.
    const cache = new Map<string, Lookup>();
    const lookup = async (name: string, pace: boolean): Promise<Lookup> => {
      const hit = cache.get(name);
      if (hit) return hit;
      if (pace && gap) await sleep(gap);
      const r = await resolveArtistAction(name, minFollowers);
      cache.set(name, r);
      return r;
    };

    try {
      for (let i = 0; i < names.length; i++) {
        if (cancelRef.current) break;
        setProgress({ done: i, total: names.length });
        const name = names[i];
        patchByName(name, { status: "checking" });
        const r = await lookup(name, i > 0);

        if (r.status === "valid") {
          patchByName(name, artistFromLookup(name, r));
          continue;
        }

        // Combined name didn't resolve — retry the "&"-separated parts. Split
        // the row only if at least one part matches; an unresolvable duo name
        // ("Aly & Fila" under the follower floor) stays intact for manual entry.
        const parts = ampParts(name);
        if (parts.length > 1) {
          const resolved: Artist[] = [];
          for (const part of parts) {
            if (cancelRef.current) break;
            resolved.push(artistFromLookup(part, await lookup(part, true)));
          }
          if (
            resolved.length === parts.length &&
            resolved.some((a) => a.status === "valid")
          ) {
            replaceByName(name, resolved);
            continue;
          }
        }

        patchByName(name, { status: "idle" }); // leave blank for manual entry
      }
    } finally {
      setRunning(false);
      setProgress(null);
    }
  }

  // Validate the handles you typed/pasted, one at a time with the same pacing.
  async function validateAll() {
    if (running) return;
    const jobs: { ti: number; ai: number; handle: string }[] = [];
    tracks.forEach((t, ti) =>
      t.artists.forEach((a, ai) => {
        if (a.handle.trim()) jobs.push({ ti, ai, handle: a.handle.trim() });
      }),
    );
    if (!jobs.length) return;

    setRunning(true);
    cancelRef.current = false;
    const gap = Math.max(0, delaySec) * 1000;
    try {
      for (let i = 0; i < jobs.length; i++) {
        if (cancelRef.current) break;
        setProgress({ done: i, total: jobs.length });
        const j = jobs[i];
        setArtist(j.ti, j.ai, { status: "checking" });
        const r = await validateHandleAction(j.handle);
        setArtist(
          j.ti,
          j.ai,
          r.status === "valid"
            ? {
                status: "valid",
                handle: r.handle,
                displayName: r.name,
                followers: r.followers,
              }
            : { status: "invalid", displayName: undefined, followers: undefined },
        );
        if (gap && i < jobs.length - 1 && !cancelRef.current) await sleep(gap);
      }
    } finally {
      setRunning(false);
      setProgress(null);
    }
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

  async function copyLinks() {
    try {
      await navigator.clipboard.writeText(
        followList.map((f) => `https://soundcloud.com/${f.handle}`).join("\n"),
      );
      setCopiedLinks(true);
      setTimeout(() => setCopiedLinks(false), 1500);
    } catch {
      /* clipboard blocked — links are still clickable below */
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
          Names with &ldquo;&amp;&rdquo; are treated as one act (Aly &amp; Fila);
          auto-resolve splits them only when the combined name has no SoundCloud
          match.
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
              disabled={running}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright disabled:opacity-60"
            >
              Auto-resolve handles
            </button>
            <button
              type="button"
              onClick={validateAll}
              disabled={running}
              className="rounded-full border border-line px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright disabled:opacity-60"
            >
              Validate all handles
            </button>
            {running && (
              <button
                type="button"
                onClick={stop}
                className="rounded-full border border-red-500/50 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
              >
                Stop
              </button>
            )}
            <label className="flex items-center gap-2 text-sm text-faint">
              Min followers
              <input
                type="number"
                min={0}
                step={50}
                value={minFollowers}
                disabled={running}
                onChange={(e) => setMinFollowers(Math.max(0, Number(e.target.value) || 0))}
                className="w-20 rounded-lg border border-line bg-ink px-2 py-1 text-fg focus:border-accent focus:outline-none disabled:opacity-60"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-faint">
              Delay (s)
              <input
                type="number"
                min={0}
                step={1}
                value={delaySec}
                disabled={running}
                onChange={(e) => setDelaySec(Math.max(0, Number(e.target.value) || 0))}
                className="w-16 rounded-lg border border-line bg-ink px-2 py-1 text-fg focus:border-accent focus:outline-none disabled:opacity-60"
              />
            </label>
            <span className="ml-auto text-sm text-faint">
              {running && progress
                ? `Working ${progress.done}/${progress.total}…`
                : `${validCount}/${totalArtists} artists linked`}
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
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-sm text-muted">
                  <input
                    type="checkbox"
                    checked={bullets}
                    onChange={(e) => setBullets(e.target.checked)}
                    className="h-4 w-4 accent-[var(--accent)]"
                  />
                  Bullets
                </label>
                <button
                  type="button"
                  onClick={copyOutput}
                  className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-transform hover:bg-accent-bright active:scale-[0.98]"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-faint">
              Only validated handles are appended — unconfirmed artists stay as plain
              text, so you never paste a dead link. Bullets keep the tracklist
              readable on Apple/Amazon/YouTube (paste under your intro line).
            </p>
            <textarea
              readOnly
              rows={Math.min(Math.max(tracks.length, 4), 24)}
              value={output}
              className={`${field} mt-3 font-mono`}
            />
          </section>

          {/* Follow checklist */}
          {followList.length > 0 && (
            <section>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium text-fg">
                  Follow checklist · {followList.length}
                </h2>
                <button
                  type="button"
                  onClick={copyLinks}
                  className="rounded-full border border-line px-5 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright"
                >
                  {copiedLinks ? "Copied ✓" : "Copy links"}
                </button>
              </div>
              <p className="mt-1 text-sm text-faint">
                Every linked artist in this mix — open each and follow any you
                don&rsquo;t already. SoundCloud doesn&rsquo;t expose your full follow
                list publicly, so this can&rsquo;t pre-filter the ones you have.
              </p>
              <ul className="mt-3 grid gap-1.5">
                {followList.map((f) => (
                  <li key={f.handle}>
                    <a
                      href={`https://soundcloud.com/${f.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex flex-wrap items-center gap-2 text-sm text-fg transition-colors hover:text-accent-bright"
                    >
                      <span className="font-medium">{f.name}</span>
                      <span className="text-faint">@{f.handle}</span>
                      {f.followers != null && (
                        <span className="text-faint">· {fmtFollowers(f.followers)}</span>
                      )}
                      <span className="text-faint transition-transform group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
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
