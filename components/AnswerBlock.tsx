import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { CalendarCheck, EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { ContactLink } from "./ContactLink";
import { site } from "@/lib/site";
import { venues, type Venue } from "@/lib/venues";

// The factual answer under the hero headline: who Eddie is, where he plays,
// how to book. Answer engines quote the first plain sentences of a page, and
// until now the first words on "/" were the tagline; the About intro sits a
// screen lower. Rendered on the server (page.tsx passes it into <Hero />) and
// outside the hero's motion container, so it is in the HTML and visible from
// first paint. Facts come from lib/site.ts and lib/venues.ts only.
//
// Laid out as a full-width strip of three columns (About · Residencies & sets ·
// Booking) so the lines stay a readable length; the sentences are unchanged.
const residencies = venues.filter((v) => v.relation === "Resident DJ");
const sets = venues.filter((v) => v.relation !== "Resident DJ");

const venueLink =
  "text-fg underline decoration-line underline-offset-4 transition-colors hover:text-accent-bright hover:decoration-accent";

function VenueLink({ venue }: { venue: Venue }) {
  return (
    <Link href={`/venues/${venue.slug}`} className={venueLink}>
      {venue.name}
    </Link>
  );
}

/** listNames for nodes: "a, b and c". */
function joinNames(items: ReactNode[]): ReactNode {
  return items.map((item, i) => (
    <Fragment key={i}>
      {i === 0 ? "" : i === items.length - 1 ? " and " : ", "}
      {item}
    </Fragment>
  ));
}

function Column({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="p-6 md:p-7">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-faint">{label}</p>
      {children}
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-bright transition-colors group-hover:bg-accent group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-faint">{label}</span>
        <span className="block font-medium text-fg transition-colors group-hover:text-accent-bright">
          {value}
        </span>
      </span>
    </span>
  );
}

const contactCard =
  "group rounded-xl border border-line bg-surface/40 px-4 py-3 transition-colors hover:border-accent/60";

export function AnswerBlock() {
  return (
    <div className="mt-14 grid divide-y divide-line overflow-hidden rounded-card border border-line bg-ink/70 text-[15px] leading-relaxed text-muted backdrop-blur-sm lg:grid-cols-[1.2fr_1fr_1fr] lg:divide-x lg:divide-y-0">
      <Column label="About">
        <p className="text-pretty">
          <span className="font-medium text-fg">{site.name}</span> is a house and trance DJ
          based in {site.location}. He first DJed in Atlanta, for about two years in his early
          20s, and has played the Jacksonville area since {site.jacksonvilleSince}. He plays
          bars, lounges and rooftops across Jacksonville and Northeast Florida, and plays house
          at private events such as birthdays and pool parties.
        </p>
      </Column>

      <Column label="Residencies & sets">
        <p className="text-pretty">
          He
          {residencies.length > 0 && (
            <>
              {" "}has held residencies at{" "}
              {joinNames(
                residencies.map((v) => (
                  <Fragment key={v.slug}>
                    <VenueLink venue={v} /> ({[v.area, v.years].filter(Boolean).join(", ")})
                  </Fragment>
                )),
              )}
            </>
          )}
          {residencies.length > 0 && sets.length > 0 && ", and"}
          {sets.length > 0 && (
            <>
              {" "}played sets at {joinNames(sets.map((v) => <VenueLink key={v.slug} venue={v} />))}
            </>
          )}
          .
        </p>
      </Column>

      <Column label="Booking">
        <div className="grid gap-3 sm:flex sm:flex-wrap lg:flex-col">
          {site.phone && (
            <ContactLink href={`tel:${site.phone.e164}`} method="phone" className={contactCard}>
              <ContactRow icon={<Phone size={18} weight="bold" />} label="Call or text" value={site.phone.display} />
            </ContactLink>
          )}
          <ContactLink href={`mailto:${site.bookingEmail}`} method="email" className={contactCard}>
            <ContactRow icon={<EnvelopeSimple size={18} weight="bold" />} label="Email" value={site.bookingEmail} />
          </ContactLink>
          <Link href={site.bookingUrl} className={contactCard}>
            <ContactRow icon={<CalendarCheck size={18} weight="bold" />} label="Date, venue & event type" value="Booking form" />
          </Link>
        </div>
      </Column>
    </div>
  );
}
