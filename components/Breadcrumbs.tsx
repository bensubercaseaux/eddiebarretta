import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

export type Crumb = {
  name: string;
  /** Site-relative path, e.g. "/" or "/mixes/currents". */
  href: string;
};

/**
 * Visible breadcrumb trail for the detail routes, and the single source the
 * page's BreadcrumbList JSON-LD is built from (see `crumbsToJsonLd`). Google
 * expects breadcrumb markup to describe a path the visitor can actually see
 * and click — a lone "back" link doesn't describe one — so the two are
 * deliberately generated from the same array rather than maintained separately.
 *
 * The last crumb is the current page: rendered as plain text, not a link.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {items.map((crumb, i) => {
          const isCurrent = i === items.length - 1;
          return (
            <li key={crumb.href} className="flex min-w-0 items-center gap-x-1.5">
              {i > 0 && (
                <CaretRight
                  size={12}
                  weight="bold"
                  aria-hidden="true"
                  className="shrink-0 text-faint"
                />
              )}
              {isCurrent ? (
                // A long mix title shouldn't push the trail off a phone screen.
                <span
                  aria-current="page"
                  className="truncate font-medium text-fg"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="font-medium text-muted transition-colors hover:text-fg"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * The same crumbs as a schema.org BreadcrumbList node, with paths resolved to
 * absolute URLs (Google requires absolute `item` URLs).
 */
export function crumbsToJsonLd(items: Crumb[], origin: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      // Avoid a trailing slash on the origin for the home crumb.
      item: crumb.href === "/" ? origin : `${origin}${crumb.href}`,
    })),
  };
}
