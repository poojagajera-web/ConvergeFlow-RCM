import { SitePage, metadataFor } from "@/components/site/SitePage";
import { getSitePage } from "@/content/site";

const page = getSitePage("/demo/")!;

export const metadata = metadataFor(page.seo, page.route);

export default function DemoPage() {
  return <SitePage page={page} />;
}
