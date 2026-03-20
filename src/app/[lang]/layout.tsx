import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { locales } from "@/dictionaries";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Antalya VIP Transfer | Premium Airport & City Transfer",
  description:
    "Antalya Airport VIP transfer service. Safe, comfortable airport transfer with luxury vehicles. Mercedes V-Class, S-Class and Sprinter fleet.",
  metadataBase: new URL("https://antalyaviptransfer.com"),
  alternates: {
    canonical: "/",
    languages: {
      tr: "/tr",
      en: "/en",
      de: "/de",
      ru: "/ru",
    },
  },
  openGraph: {
    title: "Antalya VIP Transfer",
    description: "Premium airport transfer service in Antalya",
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US", "de_DE", "ru_RU"],
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.theme==='dark'||(!localStorage.theme&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body className="min-h-screen bg-base text-text font-sans">
        <a href="#main-content" className="skip-link">İçeriğe atla</a>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
