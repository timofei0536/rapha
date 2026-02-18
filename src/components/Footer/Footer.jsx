import "./Footer.scss";
import Image from "next/image";
import Link from "next/link";
import PhoneIcon from "@/components/ui/icons/Phone";
import LocationIcon from "@/components/ui/icons/Location";
import CalendarIcon from "@/components/ui/icons/Calendar";
import Decor from "@/components/ui/icons/Decor";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="center-wrap">
                <div className="footer__wrap">
                            <Link href="/" className="footer__logo-link">
                                <Image 
                                    className="footer__logo"
                                    src="/images/logo--white.png" 
                                    alt="Polyclinique El Rapha Logo" 
                                    width={225} 
                                    height={160}
                                />
                            </Link>

                        
                        <nav className="footer__nav">
                            <span className="footer__title">Pages</span>
                            <Link href="/" className="footer__link link-hover">Home</Link>
                            <Link href="/polyclinic" className="footer__link link-hover">Polyclinic</Link>
                            <Link href="/services" className="footer__link link-hover">Services</Link>
                            <Link href="/news" className="footer__link link-hover">News</Link>
                            <Link href="/careers" className="footer__link link-hover">Careers</Link>
                            <Link href="/contact" className="footer__link link-hover">Contact</Link>
                        </nav>

                    <div className="footer__col footer__col--contact">
                        <div className="footer__contact-item">
                            <PhoneIcon className="footer__contact-icon" />
                            <a href="tel:+241077986660" className="footer__contact-text footer__link link-hover">+241 077 986 660</a>
                        </div>
                        <div className="footer__contact-item">
                            <LocationIcon className="footer__contact-icon" />
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Three+Quarters,+Libreville,+Gabon"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__contact-text footer__link link-hover"
                            >
                                Three Quarters,<br/> Libreville, Gabon
                            </a>
                        </div>
                        <div className="footer__contact-item">
                            <CalendarIcon className="footer__contact-icon" />
                            <span className="footer__contact-text">7 days a week, 24/7</span>
                        </div>
                    </div>

                    <div className="footer__col footer__col--emails">
                        <a href="mailto:contact@el-raphaga.com" className="footer__email link-hover">contact@el-raphaga.com</a>
                        <a href="mailto:recrutement@el-raphaga.com" className="footer__email link-hover">recrutement@el-raphaga.com</a>
                        <nav className="footer__nav footer__nav--legal">
                            <Link href="/terms" className="footer__link link-hover">Terms & Conditions</Link>
                            <Link href="/privacy" className="footer__link link-hover">Privacy Policy</Link>
                        </nav>
                    </div>
                </div>
            </div>
            <Decor className='decore' />
        </footer>
    );
}