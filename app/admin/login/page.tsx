import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-[100dvh] place-items-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-faint">
          Eddie Barretta
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Admin
        </h1>
        <p className="mt-2 text-sm text-muted">
          Sign in to manage your shows.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
