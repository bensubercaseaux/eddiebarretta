import Link from "next/link";
import { ContactLink } from "./ContactLink";
import { site } from "@/lib/site";
import { listNames, venues, type Venue } from "@/lib/venues";

// The factual answer under the hero headline: who Eddie is, where he plays,
// how to book. Answer engines quote the first plain sentences of a page, and
// until now the first words on "/" were the tagline; the About intro sits a
// screen lower. Rendered on the server (page.tsx passes it into <Hero />) and
// outside the hero's motion container, so it is in the HTML and visible from
// first paint. Facts come from lib/site.ts and lib/venues.ts only.
const residencies = venues.filter((v) => v.relation === "Resident DJ");
const sets = venues.filter((v) => v.relation !== "Resident DJ");

// "SIP Cocktail Bar (Downtown Jacksonville)", plus the years once venues.ts has them.
const withArea = (v: Venue) => `${v.name} (${[v.area, v.years].filter(Boolean).join(", ")})`;

const played = [
  residencies.length ? `has held residencies at ${listNames(residencies.map(withArea))}` : "",
  sets.length ? `played sets at ${listNames(sets.map((v) => v.name))}` : "",
]
  .filter(Boolean)
  .join(", and ");

const link = "text-accent-bright underline-offset-4 hover:underline";

export function AnswerBlock() {
  return (
    <div className="mt-10 max-w-xl rounded-card border border-line bg-ink/70 p-5 text-sm leading-relaxed text-muted backdrop-blur-sm md:text-[15px]">
      <p>
        <span className="font-medium text-fg">{site.name}</span> is a house and trance DJ
        based in {site.location}, playing the Jacksonville area since {site.jacksonvilleSince}.
        He plays bars, lounges and rooftops across Jacksonville and Northeast Florida, and
        plays house at private events such as birthdays and pool parties.
        {played && ` He ${played}.`}
      </p>
      <p className="mt-2">
        Booking:{" "}
        {site.phone && (
          <>
            call or text{" "}
            <ContactLink href={`tel:${site.phone.e164}`} method="phone" className={link}>
              {site.phone.display}
            </ContactLink>
            ,{" "}
          </>
        )}
        email{" "}
        <ContactLink href={`mailto:${site.bookingEmail}`} method="email" className={link}>
          {site.bookingEmail}
        </ContactLink>
        , or use the{" "}
        <Link href={site.bookingUrl} className={link}>
          booking form
        </Link>
        .
      </p>
    </div>
  );
}
