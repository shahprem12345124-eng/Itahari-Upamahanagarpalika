import { siteUrl } from "../lib/siteMetadata";

const publicPages = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/news", changeFrequency: "daily", priority: 0.8 },
  { path: "/complaint", changeFrequency: "monthly", priority: 0.7 },
  {
    path: "/tourist-places",
    changeFrequency: "monthly",
    priority: 0.8,
    images: [
      "/tourist-places/taltalaiya.png",
      "/tourist-places/yippee-land.png",
      "/tourist-places/gokulam-resort.png",
      "/tourist-places/gokarna-resort.png",
      "/tourist-places/muktidham.png",
      "/tourist-places/budhi-river-ghat.png",
      "/tourist-places/bhatbhateni.png",
    ],
  },
];

export default function sitemap() {
  return publicPages.map(({ path, images, ...page }) => ({
    url: new URL(path, siteUrl).toString(),
    ...page,
    ...(images ? { images: images.map((image) => new URL(image, siteUrl).toString()) } : {}),
  }));
}
