"use client";

import "./Footer.scss";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PhoneIcon from "@/components/ui/icons/Phone";
import LocationIcon from "@/components/ui/icons/Location";
import CalendarIcon from "@/components/ui/icons/Calendar";
import Decor from "@/components/ui/icons/Decor";
import { useGeneral } from "@/context/GeneralContext";

export default function Footer({ contactInfo }) {
    const isHome = usePathname() === "/";
    const phone = contactInfo?.phone;
    const address = contactInfo?.address;
    const email = contactInfo?.email;
    const { schedule, navigation } = useGeneral();

    return (
        <footer className="footer white-header">
            <div className="center-wrap">
                <div className="footer__wrap">
                            <Link
                                href="/"
                                className="footer__logo-link"
                                onClick={isHome ? (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } : undefined}
                            >
                                <Image 
                                    className="footer__logo"
                                    src="/images/logo--white.png" 
                                    alt="Polyclinique El Rapha Logo" 
                                    width={300} 
                                    height={116}
                                />
                            </Link>

                        
                        <nav className="footer__nav">
                            <span className="footer__title">Menu:</span>
                            {(navigation ?? []).map((item) => (
                              <Link key={item.href} href={item.href} className="footer__link link-hover">{item.text || ""}</Link>
                            ))}
                        </nav>

                    <div className="footer__col footer__col--contact">
                        {phone?.href && (
                        <div className="footer__contact-item">
                            <PhoneIcon className="footer__contact-icon" />
                            <a href={phone.href} className="footer__contact-text footer__link link-hover">{phone.text || ""}</a>
                        </div>
                        )}
                        {address?.href && (
                        <div className="footer__contact-item">
                            <LocationIcon className="footer__contact-icon" />
                            <a
                                href={address.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer__contact-text footer__link link-hover link-hover--simple"
                            >
                                {(address.text || "").split("\n").map((line, i, arr) => <span key={i}>{line}{i < arr.length - 1 && <br />}</span>)}
                            </a>
                        </div>
                        )}
                        <div className="footer__contact-item">
                            <CalendarIcon className="footer__contact-icon" />
                            <span className="footer__contact-text">{schedule ?? "7 days a week, 24/7"}</span>
                        </div>
                    </div>

                    <div className="footer__col footer__col--emails">
                        {email?.href && <a href={email.href} className="footer__email link-hover">{email.text || ""}</a>}
                        <a href="mailto:recrutement@el-raphaga.com" className="footer__email link-hover">recrutement@el-raphaga.com</a>
                        <nav className="footer__nav footer__nav--legal">
                            <Link href="/terms-conditions" className="footer__link link-hover">Terms & Conditions</Link>
                            <Link href="/privacy-policy" className="footer__link link-hover">Privacy Policy</Link>
                        </nav>
                    </div>
                </div>
            </div>
            <Decor className='decore' />
        </footer>
    );
}