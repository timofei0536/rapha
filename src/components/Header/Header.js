import "./Header.scss";
import Link from "next/link";
import Image from "next/image";
import PhoneIcon from "@/components/icons/Phone";
import CalendarIcon from "@/components/icons/Calendar";
import LocationIcon from "@/components/icons/Location";
import Search from "@/components/Search/Search";


export default function Header() {
  return (
      <header className='header'>
        <div className="center-wrap">
          <div className="header__top">
            <div className="center-wrap center-wrap--small">
                <div className="header__item">
                  <PhoneIcon />
                  <span>+241 077 986 660</span>
                </div>
                <div className="header__item">
                  <CalendarIcon />
                  <span>7 days a week, 24/7</span>
                </div>
                <div className="header__item">
                  <LocationIcon />
                  <span>Three Quarters, Libreville, Gabon</span>
                </div>
              </div>
          </div>   
        
        <div className="header__main">
          <Link href="/" className="header__logo-link">
            <Image src="/images/logo.png" alt="Logo" className="header__logo" width={177} height={70}/>
          </Link>
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item"><Link href="/" className="header__nav-link">Home</Link></li>
              <li className="header__nav-item"><Link href="/polyclinic" className="header__nav-link">Polyclinic</Link></li>
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