import type { Metadata } from "next";
import { ServiceLanding, serviceMetadata } from "@/components/ServiceLanding";
import { servicePages } from "@/lib/services";

const page = servicePages.barLounge;

export const metadata: Metadata = serviceMetadata(page);

export default function BarLoungeDjPage() {
  return <ServiceLanding page={page} />;
}
