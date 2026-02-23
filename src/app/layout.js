import Script from 'next/script'; // 1. Импортируем компонент
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import 'normalize.css';
import "@/styles/globals.scss";
// import Preloader from '@/components/Preloader/Preloader'; // disabled for now
import Header from '@/components/Header/Header';
import AnimationsInit from '@/components/AnimationsInit/AnimationsInit';
import Footer from '@/components/Footer/Footer';
import { getContactInfoForLayout } from "@/lib/rapha";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ivyPresto = localFont({
  src: [
    {
      path: '../../public/fonts/Ivy-Presto/ivy-presto-display-100.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ivy-Presto/ivy-presto-display-300.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ivy-Presto/ivy-presto-display-400.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Ivy-Presto/ivy-presto-display-600.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-ivy-presto',
  display: 'swap',
});


const SITE_NAME = "El-Rapha";

export const metadata = {
  title: {
    template: `${SITE_NAME} — %s`,
    default: SITE_NAME,
  },
  icons: {
    icon: "/images/svg/favicon.png",
  },
};

export default async function RootLayout({ children }) {
  const contactInfo = await getContactInfoForLayout();

  return (
    <html lang="en" className={`${inter.variable} ${ivyPresto.variable}`}>
      <body>
        {/* <Preloader /> */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js" 
          strategy="beforeInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/ScrollTrigger.min.js" 
          strategy="beforeInteractive" 
        />
        <Header contactInfo={contactInfo} />
        <AnimationsInit />
        {children}
        <Footer contactInfo={contactInfo} />
      </body>
    </html>
  );
}


// 1) add node_modeules to ignore
// 2) add favicon to meta, create red favicon.
// 3) remove page.module
// 4) add btn-component.
// 5) header styles.
// 6) add select component
// 7) add .content
// 8) add img-wrap style.
// 9) gsap подключить

//////



// 1) chart уточнить
// 2) careers form.
// 3) news - pagination.
// 5) services -> ask about it.
// 5) structure  -> 2 columns.
// 6) hero select z-index.

// 1) html to loops
// 2) adaptive
// 3) animations



// THEME:
// Включить ошибки в function.php
// Включить RestAPi
// По умолчанию включить ACF, а то скрыто.
// в fucntion.js добавить nextwp по умолчанию если он существует.


// NEXTWP:

// 1) надо page update  прежде чем acf сохранятся.
// 2) ссылки не натянулись.

// Contact
// 1) 3я items ограничить.
// 2) svg icons натянуть.



// EDITS:

// 1) PageScreen натянуть
// 2) text page натянуть.


// HIGH P:

// 1) adaptive pp.
// 2) mobile-menu
// 3) content
// 4) build и пенос на сервер.
// 5) presentation.
// 6) animations
// 7) new вылезла

// MIDDLE P
// 1) 404 натянуть и check bg
// 2) fix content ( apply .content )
// 3) chart gradient on mobile.
// 4) tablet
// 5) tablet
// 6) share

// LOW P:

// 1) btn -> svg.
// 2) Career -> create br
// 3) Contact -> book appointment title.
// 4) chart натянуть
// 5) изображения которые изначлаьно обрезаны в radius на мобилке остаются такими же.

// QUESTIONS:
// 1) fonts решить.
// 2) about -> content --reverse on mobile