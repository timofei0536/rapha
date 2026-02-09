import { Inter } from "next/font/google";
import 'normalize.css';
import "@/styles/globals.scss";

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


const SITE_NAME = "WebsiteName";

export const metadata = {
  title: {
    template: `${SITE_NAME} — %s`,
    default: SITE_NAME,
  },
  icons: {
    icon: "/images/favicon.png",
  },
};




export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}


// 1) add node_modeules to ignore
// 2) add favicon to meta, create red favicon.