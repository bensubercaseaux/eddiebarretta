"use client";

import { useActionState } from "react";
import type { FormState } from "./actions";
import type { Show } from "@/lib/shows";

const field =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-fg placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";
const label = "text-sm font-medium text-fg";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

export function ShowForm({
  action,
  initial,
  submitLabel,
}: {
  action: Action;
  initial?: Partial<Show>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="date" className={label}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={initial?.date}
            className={field}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="time" className={label}>
            Time
          </label>
          <input
            id="time"
            name="time"
            required
            placeholder="6:00 - 10:00 PM"
            defaultValue={initial?.time}
            className={field}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="name" className={label}>
          Event name
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Sunset Party"
          defaultValue={initial?.name}
          className={field}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="venue" className={label}>
            Venue
          </label>
          <input
            id="venue"
            name="venue"
            required
            placeholder="SIP Cocktail Bar"
            defaultValue={initial?.venue}
            className={field}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="city" className={label}>
            City
          </label>
          <input
            id="city"
            name="city"
            required
            placeholder="Jacksonville Beach"
            defaultValue={initial?.city}
            className={field}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-line bg-ink px-4 py-3">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={initial?.isPublic ?? true}
          className="size-4 accent-accent"
        />
        <span className="text-sm text-fg">
          Public{" "}
          <span className="text-faint">
            — show this gig on the website (uncheck to keep it private)
          </span>
        </span>
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="justify-self-start rounded-full bg-accent px-7 py-3 font-medium text-white transition-transform duration-200 hover:bg-accent-bright active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
