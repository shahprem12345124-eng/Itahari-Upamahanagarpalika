import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import BottomNav from "./components/BottomNav";
import { LanguageProvider } from "./components/LanguageProvider";
import { siteDescription, siteName, siteTitle, siteUrl, socialImage } from "../lib/siteMetadata";

export const metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: "%s | इटहरी उपमहानगरपालिका",
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "इटहरी उपमहानगरपालिका",
    "इटहरी नागरिक सेवा",
    "इटहरी पर्यटकीय स्थल",
    "Itahari Sub-Metropolitan City",
    "Itahari citizen services",
    "Itahari tourism",
    "Sunsari",
    "Koshi Province",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ne_NP",
    alternateLocale: ["en_US"],
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ne" data-scroll-behavior="smooth">
      <body>
        <LanguageProvider>
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
