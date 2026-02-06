import { Geist, Geist_Mono } from "next/font/google";
import 'normalize.css';
import "@/styles/globals.scss";

import Header from '@/components/Header/Header';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "WebsiteName";

export const metadata = {
  title: {
    template: `${SITE_NAME} — %s`,
    default: SITE_NAME,
  },
};




export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}