"use client";

import { useEffect, useState } from "react";
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
import { scrollToTop } from "@/animations/lib/lenis";

export default function Header({ contactInfo }) {
  const isHome = usePathname() === "/";
  const [itsDesktop, setItsDesktop] = useState(false);
  useEffect(() => {
    setItsDesktop(Boolean(window.its_desktop));
  }, []);
  const phone = contactInfo?.phone;
  const address = contactInfo?.address;
  const { schedule, navigation } = useGeneral();

  return (
      <header
        className={`header${isHome && itsDesktop ? ' anim-initial' : ''}`}
        style={isHome && itsDesktop ? { '--anim-y': '-100%' } : undefined}
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
                  {schedule ? <span>{schedule}</span> : null}
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
              onClick={isHome ? scrollToTop : undefined}
            >
              <Image src="/images/logo.png" alt="El-Rapha — Home" className="header__logo" width={177} height={70} quality={95} priority />
            </Link>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {(navigation ?? []).map((item, index) => (
                  <li key={`${item.href || ""}-${item.text || ""}-${index}`} className="header__nav-item">
                    <Link href={item.href} className="header__nav-link link-hover">{item.text || ""}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Search />
            <button
              type="button"
              className="header__burger desktop--hide"
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="mobile-menu"
            >
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