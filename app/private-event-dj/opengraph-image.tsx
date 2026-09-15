import { serviceOgImage, serviceOgSize } from "@/components/ServiceOgImage";
import { servicePages } from "@/lib/services";

const page = servicePages.privateEvent;

export const alt = `${page.h1} — Eddie Barretta, House & Trance DJ`;
export const size = serviceOgSize;
export const contentType = "image/png";

export default function Image() {
  return serviceOgImage(page.ogTitle, page.ogSubtitle, `eddiebarretta.com/${page.slug}`);
}
