"use client";

import "./MobileMenu.scss";
import Link from "next/link";
import Search from "@/components/ui/Search/Search";
import { useGeneral } from "@/context/GeneralContext";

export default function MobileMenu() {
  const { navigation } = useGeneral();
  const navItems = (navigation ?? []).map((item) => ({ href: item.href, label: item.text || "" }));

  return (
    <div className="mobile-menu" aria-hidden="true">
      <div className="mobile-menu__content">
        <div className="center-wrap">
          <nav className="mobile-menu__nav">
            <ul className="mobile-menu__nav-list">
              {navItems.map(({ href, label }) => (
                <li key={href} className="mobile-menu__nav-item">
                  <Link
                    href={href}
                    className="mobile-menu__nav-link"
                    onClick={() => typeof window !== "undefined" && window.hideMenu?.()}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Search />
        </div>
      </div>
    </div>
  );
}
