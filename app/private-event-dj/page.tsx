import type { Metadata } from "next";
import { ServiceLanding, serviceMetadata } from "@/components/ServiceLanding";
import { servicePages } from "@/lib/services";

const page = servicePages.privateEvent;

export const metadata: Metadata = serviceMetadata(page);

export default function PrivateEventDjPage() {
  return <ServiceLanding page={page} />;
}
