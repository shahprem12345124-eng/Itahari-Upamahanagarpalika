export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://itahari.vercel.app",
);

export const siteName = "इटहरी उपमहानगरपालिका";
export const siteTitle = "इटहरी उपमहानगरपालिका | नागरिक सेवा पोर्टल";
export const siteDescription =
  "इटहरी उपमहानगरपालिकाको नागरिक सेवा पोर्टलबाट अनलाइन गुनासो दर्ता गर्नुहोस्, ताजा सूचना हेर्नुहोस् र नगर सेवाबारे जानकारी लिनुहोस्।";
export const socialImage = {
  url: "/itahari-city.png",
  width: 516,
  height: 387,
  alt: "इटहरी शहरको हवाई दृश्य",
};

export function createPageMetadata({ title, description, path, noIndex = false }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      locale: "ne_NP",
      type: "website",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
