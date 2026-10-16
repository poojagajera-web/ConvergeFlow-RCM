import { ContentPage, pageMetadata } from "@/components/content/ContentPage";
import { getPage } from "@/content/pages";

const page = getPage("/demo/")!;

export const metadata = pageMetadata(page);

export default function DemoPage() {
  return <ContentPage page={page} />;
}
