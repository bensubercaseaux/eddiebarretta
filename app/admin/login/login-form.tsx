"use client";

import { useActionState } from "react";
import { login, type FormState } from "../actions";

const field =
  "w-full rounded-xl border border-line bg-ink px-4 py-3 text-fg placeholder:text-faint transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="username" className="text-sm font-medium text-fg">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className={field}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-medium text-fg">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
        />
      </div>

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
        className="rounded-full bg-accent px-7 py-3 font-medium text-white transition-transform duration-200 hover:bg-accent-bright active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
