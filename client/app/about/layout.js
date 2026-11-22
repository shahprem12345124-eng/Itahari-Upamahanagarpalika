import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "नगर परिचय",
  description: "इटहरी उपमहानगरपालिकाको परिचय, सेवा, जिम्मेवारी र विकासका प्राथमिकताबारे जानकारी।",
  path: "/about",
});

export default function AboutLayout({ children }) {
  return children;
}
