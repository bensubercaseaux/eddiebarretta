"use client";

import { useState } from "react";
import type { Show } from "@/lib/shows";
import { Reveal } from "./Reveal";
import { ShowCard } from "./ShowCard";

const INITIAL_COUNT = 10;

// Newest-first list of past gigs, capped at 10 with a one-click reveal for the
// full history. The year count is large (the whole gig archive lives here), so
// the collapsed view keeps the homepage scannable.
export function PastSets({ shows }: { shows: Show[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? shows : shows.slice(0, INITIAL_COUNT);
  const hiddenCount = shows.length - INITIAL_COUNT;

  return (
    <div className="mt-14">
      <Reveal>
        <h3 className="text-sm uppercase tracking-[0.18em] text-faint">
          Past sets
        </h3>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((s, i) => (
          <Reveal
            key={`${s.date}-${s.venue}-${i}`}
            // Cap the stagger so late rows (and the expanded batch) don't sit
            // invisible for seconds waiting on an index-scaled delay.
            delay={Math.min(i, 7) * 0.05}
          >
            <ShowCard show={s} />
          </Reveal>
        ))}
      </div>
      {!expanded && hiddenCount > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full border border-line px-6 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent-bright"
          >
            Show {hiddenCount} more sets
          </button>
        </div>
      )}
    </div>
  );
}
