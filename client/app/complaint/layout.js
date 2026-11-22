import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "अनलाइन गुनासो तथा सुझाव",
  description: "इटहरी उपमहानगरपालिकाका सेवा तथा पूर्वाधारसम्बन्धी गुनासो वा सुझाव अनलाइन दर्ता गर्नुहोस्।",
  path: "/complaint",
});

export default function ComplaintLayout({ children }) {
  return children;
}
