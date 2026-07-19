import type { Icon } from "@phosphor-icons/react";
import {
  AmazonLogo,
  ApplePodcastsLogo,
  Heart,
  SoundcloudLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

const PLATFORMS: { href: string; label: string; icon: Icon }[] = [
  { href: site.podcast.apple, label: "Apple Podcasts", icon: ApplePodcastsLogo },
  { href: site.podcast.amazon, label: "Amazon Music", icon: AmazonLogo },
  { href: site.podcast.youtube, label: "YouTube", icon: YoutubeLogo },
  { href: site.podcast.iheart, label: "iHeartRadio", icon: Heart },
  { href: site.podcast.soundcloud, label: "SoundCloud", icon: SoundcloudLogo },
];

// "Subscribe to the Transcend podcast" strip. The mixes are distributed as a
// podcast via the same SoundCloud RSS feed, so listeners can follow anywhere.
export function PodcastSubscribe({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-card border border-line bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div>
        <p className="font-display font-semibold text-fg">
          Subscribe to the Transcend podcast
        </p>
        <p className="mt-1 text-sm text-muted">
          New mixes land on your favorite app automatically.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(({ href, label, icon: PlatformIcon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-fg"
          >
            <PlatformIcon size={18} weight="fill" />
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
