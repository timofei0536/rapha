import "./Footer.scss";
import Image from "next/image";
import Link from "next/link";
import PhoneIcon from "@/components/icons/Phone";
import LocationIcon from "@/components/icons/Location";
import CalendarIcon from "@/components/icons/Calendar";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="center-wrap">
                <div className="footer__wrap">
                            <Image 
                                className="footer__logo"
                                src="/images/logo--white.png" 
                                alt="Polyclinique El Rapha Logo" 
                                width={225} 
                                height={160}
                            />

                        
                        <nav className="footer__nav">
                            <span className="footer__title">Pages</span>
                            <Link href="/" className="footer__link">Home</Link>
                            <Link href="/polyclinic" className="footer__link">Polyclinic</Link>
                            <Link href="/services" className="footer__link">Services</Link>
                            <Link href="/news" className="footer__link">News</Link>
                            <Link href="/careers" className="footer__link">Careers</Link>
                            <Link href="/contact" className="footer__link">Contact</Link>
                        </nav>

                    <div className="footer__col footer__col--contact">
                        <div className="footer__contact-item">
                            <PhoneIcon className="footer__contact-icon" />
                            <span className="footer__contact-text">+241 077 986 660</span>
                        </div>
                        <div className="footer__contact-item">
                            <LocationIcon className="footer__contact-icon" />
                            <span className="footer__contact-text">Three Quarters,<br/> Libreville, Gabon</span>
                        </div>
                        <div className="footer__contact-item">
                            <CalendarIcon className="footer__contact-icon" />
                            <span className="footer__contact-text">7 days a week, 24/7</span>
                        </div>
                    </div>

                    <div className="footer__col footer__col--emails">
                        <a href="mailto:contact@el-raphaga.com" className="footer__email">contact@el-raphaga.com</a>
                        <a href="mailto:recrutement@el-raphaga.com" className="footer__email">recrutement@el-raphaga.com</a>
                    </div>
                </div>
            </div>
            <div className="footer__pattern"></div>
        </footer>
    );
}