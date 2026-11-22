import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "इटहरीका पर्यटकीय स्थलहरू",
  description: "तालतलैया, यिप्पी ल्यान्ड, मुक्तिधामलगायत इटहरी तथा आसपासका रमणीय स्थल र घुम्नलायक ठाउँहरू पत्ता लगाउनुहोस्।",
  path: "/tourist-places",
});

export default function TouristPlacesLayout({ children }) {
  return children;
}
