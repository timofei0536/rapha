import styles from './Header.module.scss';
import Link from "next/link";
import Image from "next/image";
import PhoneIcon from "@/components/icons/Phone";
import CalendarIcon from "@/components/icons/Calendar";
import LocationIcon from "@/components/icons/Location";


export default function Header() {
  return (
      <header className={styles.header}>
        <div className="center-wrap">
          <div className="header__top">
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
          <Image src="/images/logo.png" alt="Logo" className="header__logo" width={177} height={70}/>
          <nav className="header__nav">
            <ul className="header__nav-list">
              <li className="header__nav-item"><a href="" className="header__hav-link"></a></li>
            </ul>
          </nav>
        </div>

      </header>

  );
}