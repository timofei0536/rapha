"use client";

import "./Header.scss";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PhoneIcon from "@/components/ui/icons/Phone";
import CalendarIcon from "@/components/ui/icons/Calendar";
import LocationIcon from "@/components/ui/icons/Location";
import Search from "@/components/ui/Search/Search";

export default function Header() {
  const isHome = usePathname() === "/";

  return (
      <header className='header'>
        <div className="center-wrap">
          <div className="header__top">
            <div className="center-wrap center-wrap--small">
                <div className="header__item">
                  <PhoneIcon />
                  <a href="tel:+241077986660" className="header__link">+241 077 986 660</a>
                </div>
                <div className="header__item">
                  <CalendarIcon />
                  <span>7 days a week, 24/7</span>
                </div>
                <div className="header__item">
                  <LocationIcon />
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Three+Quarters,+Libreville,+Gabon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header__link"
                  >
                    Three Quarters, Libreville, Gabon
                  </a>
                </div>
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
              <li className="header__nav-item"><Link href="/" className="header__nav-link">Home</Link></li>
              <li className="header__nav-item"><Link href="/about" className="header__nav-link">Polyclinic</Link></li>
              <li className="header__nav-item"><Link href="/services" className="header__nav-link">Services</Link></li>
              <li className="header__nav-item"><Link href="/news" className="header__nav-link">News</Link></li>
              <li className="header__nav-item"><Link href="/careers" className="header__nav-link">Careers</Link></li>
              <li className="header__nav-item"><Link href="/contact" className="header__nav-link">Contact</Link></li>
            </ul>
          </nav>
          <Search />
        </div>
        </div>

      </header>

  );
}