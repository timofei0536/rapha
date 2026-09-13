import { Inter } from "next/font/google";
import localFont from "next/font/local";
import 'normalize.css';
import "@/styles/globals.scss";
import Preloader from '@/components/Preloader/Preloader';
import Header from '@/components/Header/Header';
import AnimationsInit from '@/components/AnimationsInit/AnimationsInit';
import Footer from '@/components/Footer/Footer';
import { getContactInfoForLayout, getGeneralForLayout } from "@/lib/rapha";
import { GeneralProvider } from "@/context/GeneralContext";

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
  description:
    "El-Rapha is a polyclinic offering emergency care, surgery, medical imaging, laboratory analysis, and specialist consultations 24/7.",
  icons: {
    icon: "/images/svg/favicon.png",
  },
};

export default async function RootLayout({ children }) {
  const [contactInfo, general] = await Promise.all([
    getContactInfoForLayout(),
    getGeneralForLayout(),
  ]);

  return (
    <html lang="fr" className={`${inter.variable} ${ivyPresto.variable}`}>
      <body>
        <GeneralProvider value={general}>
          <Preloader />
          <Header contactInfo={contactInfo} />
          <AnimationsInit />
          {children}
          <Footer contactInfo={contactInfo} />
        </GeneralProvider>
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
// 9) hook up gsap
// 10) adaptive, change tablet vars.

//////



// 1) clarify chart
// 2) careers form.
// 3) news - pagination.
// ) services -> ask about it.
// 5) structure  -> 2 columns.
// 6) hero select z-index.
// 6) hero select z-index.

// 1) html to loops
// 2) adaptive
// 3) animations



// THEME:
// Enable errors in function.php
// Enable RestAPI
// Enable ACF by default — it is hidden otherwise.

// Contact
// 1) limit the 3rd items.
// 2) implement svg icons.



// EDITS:

// 1) implement PageScreen
// 2) implement text page.


// HIGH P:

// 1) adaptive pp.
// 2) mobile-menu
// 3) content
// 4) build and deploy to the server.
// 5) presentation.
// 6) animations
// 7) news article overflowed

// MIDDLE P
// 1) implement 404 and check bg
// 2) fix content ( apply .content )
// 3) chart gradient on mobile.
// 4) tablet
// 5) tablet
// 6) share
// 7) preview length

// LOW P:

// 1) btn -> svg.
// 2) Career -> create br
// 3) Contact -> book appointment title.
// 4) implement chart
// 5) images that start with a radius crop stay the same on mobile.

// QUESTIONS:
// 1) decide on fonts.
// 2) about -> content --reverse on mobile



// other services - last.
// shared