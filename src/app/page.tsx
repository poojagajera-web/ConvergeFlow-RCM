import { Hero } from "@/components/sections/Hero";
import { Ledger } from "@/components/sections/Ledger";
import { RevenueCycle } from "@/components/sections/RevenueCycle";
import { Pipeline } from "@/components/sections/Pipeline";
import { Industries } from "@/components/sections/Industries";
import { Process } from "@/components/sections/Process";
import { Technology } from "@/components/sections/Technology";
import { Results } from "@/components/sections/Results";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { DemoRequest } from "@/components/sections/DemoRequest";
import { MotionScope } from "@/components/motion/MotionScope";

export default function HomePage() {
  return (
    <MotionScope>
      <Hero />
      <Ledger />
      <RevenueCycle />
      <Pipeline />
      <Industries />
      <Process />
      <Technology />
      <Results />
      <Testimonials />
      <Faq />
      <DemoRequest />
    </MotionScope>
  );
}
