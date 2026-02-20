import Script from 'next/script'; // 1. Импортируем компонент
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import 'normalize.css';
import "@/styles/globals.scss";
import Header from '@/components/Header/Header';
import HeaderWhiteTrigger from '@/components/Header/HeaderWhiteTrigger';
import Footer from '@/components/Footer/Footer';

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


const SITE_NAME = "WebsiteName";

export const metadata = {
  title: {
    template: `${SITE_NAME} — %s`,
    default: SITE_NAME,
  },
  icons: {
    icon: "/images/svg/favicon.png",
  },
};




export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${ivyPresto.variable}`}>
      <body>
      <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js" 
          strategy="beforeInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/ScrollTrigger.min.js" 
          strategy="beforeInteractive" 
        />
        <Header />
        <HeaderWhiteTrigger />
        {children}
        <Footer />
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