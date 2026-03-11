"use client";

import "./Header.scss";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PhoneIcon from "@/components/ui/icons/Phone";
import CalendarIcon from "@/components/ui/icons/Calendar";
import LocationIcon from "@/components/ui/icons/Location";
import Search from "@/components/ui/Search/Search";
import MobileMenu from "@/components/MobileMenu/MobileMenu";
import { useGeneral } from "@/context/GeneralContext";

export default function Header({ contactInfo }) {
  const isHome = usePathname() === "/";
  const its_desktop = typeof window !== "undefined" && window.its_desktop;
  const phone = contactInfo?.phone;
  const address = contactInfo?.address;
  const { schedule, navigation } = useGeneral();

  return (
      <header
        className={`header${isHome && its_desktop ? ' anim-initial' : ''}`}
        style={isHome && its_desktop ? { '--anim-y': '-100%' } : undefined}
      >
        <div className="center-wrap">
          <div className="header__top">
            <div className="center-wrap center-wrap--small">
                {phone?.href && (
                <div className="header__item">
                  <PhoneIcon />
                  <a href={phone.href} className="header__link link-hover">{phone.text || ""}</a>
                </div>
                )}
                <div className="header__item">
                  <CalendarIcon />
                  <span>{schedule ?? "7 days a week, 24/7"}</span>
                </div>
                {address?.href && (
                <div className="header__item">
                  <LocationIcon />
                  <a
                    href={address.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header__link link-hover"
                  >
                    {(address.text || "").replace(/\n/g, " ")}
                  </a>
                </div>
                )}
              </div>
          </div>

          <div className="header__main">
            <Link
              href="/"
              className="header__logo-link"
              onClick={isHome ? (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } : undefined}
            >
              <Image src="/images/logo.png" alt="Logo" className="header__logo" width={177} height={70} />
            </Link>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {(navigation ?? []).map((item) => (
                  <li key={item.href} className="header__nav-item">
                    <Link href={item.href} className="header__nav-link link-hover">{item.text || ""}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Search />
            <button type="button" className="header__burger desktop--hide" aria-label="Open menu">
              <span className="header__burger-line" />
              <span className="header__burger-line" />
              <span className="header__burger-line" />
            </button>
          </div>
        </div>

        <MobileMenu />
      </header>
  );
}