import type { Metadata, Viewport } from "next";
import { Google_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
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
  themeColor: "#0a1a2b",
};

export const metadata: Metadata = {
  title: "ConvergeFlow | AI-Powered Revenue Cycle Management",
  description:
    "ConvergeFlow automates every step of RCM — from eligibility verification to payment posting — so your clinical team focuses on patients, not paperwork.",
  keywords: [
    "ConvergeFlow",
    "Revenue Cycle Management",
    "AI RCM",
    "Healthcare SaaS",
    "Insurance verification",
    "Prior authorization",
    "Denial management",
    "Payment posting",
    "QuantumDataLytica",
  ],
  authors: [{ name: "ConvergeFlow, LLC" }],
};

/**
 * Runs before first paint: flags JS so hero intro elements can start hidden,
 * and reveals them anyway if the motion layer has not booted within 3.5s.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__cfMotion)d.classList.add('motion-failsafe')},3500)})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${googleSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
