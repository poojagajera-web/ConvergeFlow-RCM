import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { RevenueCycle } from "@/components/sections/RevenueCycle";
import { Pipeline } from "@/components/sections/Pipeline";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { Technology } from "@/components/sections/Technology";
import { Results } from "@/components/sections/Results";
import { Evidence } from "@/components/sections/Evidence";
import { DemoRequest } from "@/components/sections/DemoRequest";
import { MotionScope } from "@/components/motion/MotionScope";
import { JsonLd } from "@/components/content/JsonLd";
import { HOME_META, HOME_SCHEMA } from "@/content/home";
import { ROBOTS, canonicalFor } from "@/lib/site";

const canonical = canonicalFor("/");

export const metadata: Metadata = {
  title: { absolute: HOME_META.title },
  description: HOME_META.description,
  robots: ROBOTS,
  alternates: canonical ? { canonical } : undefined,
  openGraph: { title: HOME_META.title, description: HOME_META.description, type: "website", ...(canonical ? { url: canonical } : {}) },
};

export default function HomePage() {
  return (
    <>
      <JsonLd schema={HOME_SCHEMA} />
      <MotionScope>
        <Hero />
        <RevenueCycle />
        <Pipeline />
        <Industries />
        <Process />
        <Technology />
        <Results />
        <Evidence />
        <DemoRequest />
      </MotionScope>
    </>
  );
}
