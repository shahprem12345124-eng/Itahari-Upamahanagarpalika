import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "ताजा सूचना तथा समाचार",
  description: "इटहरी उपमहानगरपालिकाका सार्वजनिक सूचना, ताजा समाचार र सेवा अपडेटहरू हेर्नुहोस्।",
  path: "/news",
});

export default function NewsLayout({ children }) {
  return children;
}
