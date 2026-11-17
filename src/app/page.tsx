import type { Metadata } from "next";
import { LandingPageView } from "@/landing/components/landing-page-view";

export const metadata: Metadata = {
  title: "Ki Bubble — Bubble Tea Artesanal",
  description:
    "Explore a anatomia do bubble tea Ki Bubble, descubra os sabores autorais do cardápio e monte sua combinação em três cliques.",
};

export default function HomePage() {
  return <LandingPageView />;
}
