import { Social } from "./Social";
import { nav, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <a href="#top" className="font-display text-xl font-bold tracking-tight">
              Eddie Barretta
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {site.role} · {site.location}. {site.serviceArea}.
            </p>
            <Social className="-ml-2 mt-4" />
          </div>

          <nav className="flex flex-col gap-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Eddie Barretta. All rights reserved.</p>
          <p>House &amp; Trance · {site.serviceArea}</p>
        </div>
      </div>
    </footer>
  );
}
