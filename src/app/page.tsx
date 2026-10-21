import { MotionScope } from "@/components/motion/MotionScope";
import { JsonLd } from "@/components/content/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import { Intro } from "@/components/home/Intro";
import { Facts } from "@/components/home/Facts";
import { HelixSection } from "@/components/home/HelixSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatusSplit } from "@/components/home/StatusSplit";
import { StageTabs } from "@/components/home/StageTabs";
import { Why } from "@/components/home/Why";
import { Timeline } from "@/components/home/Timeline";
import { Dashboard } from "@/components/home/Dashboard";
import { SiteFaq } from "@/components/site/SiteFaq";
import { Footer } from "@/components/layout/Footer";
import { faqSchema, metadataFor } from "@/components/site/SitePage";
import { HOME_CTA, HOME_FAQ, HOME_META } from "@/content/site/home";
import { SITE_URL } from "@/lib/site";

export const metadata = metadataFor(HOME_META, "/");

const schema = SITE_URL
  ? {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "ConvergeFlow", url: `${SITE_URL}/` },
        { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "ConvergeFlow", publisher: { "@id": `${SITE_URL}/#organization` } },
        faqSchema(HOME_FAQ),
      ],
    }
  : null;

export default function HomePage() {
  return (
    <>
      <JsonLd schema={schema} />
      <MotionScope>
        <main id="main" tabIndex={-1}>
          <Hero />
          <Ticker />
          <Intro />
          <Facts />
          <HelixSection />
          <HowItWorks />
          <StatusSplit />
          <StageTabs />
          <Why />
          <Timeline />
          <Dashboard />
          <SiteFaq items={HOME_FAQ} />
        </main>
        <Footer cta={HOME_CTA} />
      </MotionScope>
    </>
  );
}
