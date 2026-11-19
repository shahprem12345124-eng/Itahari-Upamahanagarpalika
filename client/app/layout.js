import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import BottomNav from "./components/BottomNav";
import { LanguageProvider } from "./components/LanguageProvider";

export const metadata = {
  title: "इटहरी उपमहानगरपालिका | नागरिक सेवा पोर्टल",
  description:
    "इटहरी उपमहानगरपालिकाको आधिकारिक नागरिक सेवा, सूचना तथा गुनासो पोर्टल।",
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
