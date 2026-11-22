import { createPageMetadata } from "../../lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "प्रशासकीय प्यानल",
  description: "इटहरी उपमहानगरपालिकाको प्रशासनिक सामग्री व्यवस्थापन प्यानल।",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({ children }) {
  return children;
}
