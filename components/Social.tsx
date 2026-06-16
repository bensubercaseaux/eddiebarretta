import {
  InstagramLogo,
  SoundcloudLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

const links = [
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramLogo },
  { href: site.socials.soundcloud, label: "SoundCloud", Icon: SoundcloudLogo },
  { href: site.socials.youtube, label: "YouTube", Icon: YoutubeLogo },
];

export function Social({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface hover:text-fg"
        >
          <Icon size={size} weight="fill" />
        </a>
      ))}
    </div>
  );
}
