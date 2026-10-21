import type { Metadata, Viewport } from "next";
import { Google_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { HOME_META } from "@/content/site/home";
import { ROBOTS, SITE_URL } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-jakarta",
  display: "swap",
});

const googleSans = Google_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-gsans",
  display: "swap",
  // next/font has no metric overrides for Google Sans; fall back to system UI fonts.
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#030807",
};

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: { default: HOME_META.title, template: "%s | ConvergeFlow" },
  description: HOME_META.description,
  applicationName: "ConvergeFlow",
  // Draft content: noindex/nofollow until the release is approved (see src/lib/site.ts).
  robots: ROBOTS,
};

/**
 * Runs before first paint: flags JS so hero intro elements can start hidden,
 * and reveals them anyway if the motion layer has not booted within 3.5s.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__cfMotion)d.classList.add('motion-failsafe')},3500)})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${jakarta.variable} ${googleSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Preloader />
        <SmoothScroll />
        <Header />
        {/* Each page renders its own <main id="main"> and footer (the footer carries the page's call to action). */}
        {children}
      </body>
    </html>
  );
}
