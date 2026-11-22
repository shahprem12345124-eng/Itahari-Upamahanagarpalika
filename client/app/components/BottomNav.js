"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";
import { NationalEmblem } from "./Brand";
import { useLanguage } from "./LanguageProvider";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const items = [
    { href: "/", label: "गृह", icon: "home" },
    { href: "/tourist-places", label: "पर्यटन स्थल", icon: "building" },
    { href: "/complaint", label: "गुनासो", emblem: true },
    { href: "/news", label: "सूचना", icon: "bell" },
    { href: "/admin", label: "प्रोफाइल", icon: "user" },
  ];

  return (
    <nav className="bottom-nav" aria-label={t("मुख्य नेभिगेसन")}>
      <div className="bottom-nav-inner">
        {items.map((item) => {
          const active = item.emblem
            ? pathname === "/complaint"
            : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return item.emblem ? (
            <Link
              key="complaint"
              href={item.href}
              className={`bottom-nav-item bottom-nav-center ${active ? "active" : ""}`}
              aria-label={t(item.label)}
            >
              <span className="bottom-nav-emblem"><NationalEmblem label={t(item.label)} /></span>
              <span>{t(item.label)}</span>
            </Link>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className={`bottom-nav-item ${active ? "active" : ""}`}
              aria-label={t(item.label)}
            >
              <Icon name={item.icon} size={25} />
              <span>{t(item.label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
