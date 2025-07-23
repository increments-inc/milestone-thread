import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWAProvider } from "@/components/PWAProvider";
import { StructuredData } from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "মাইলস্টোন কলেজ বিমান দুর্ঘটনা সহায়তা - জরুরি রক্তদান ও স্কিন ডোনেশন | নিখোঁজ তালিকা",
  description: "মাইলস্টোন কলেজ এয়ার ফোর্স বিমান দুর্ঘটনার আহতদের জন্য জরুরি রক্তদান, স্কিন ডোনেশন ও নিখোঁজ ব্যক্তির খোঁজ। ঢাকা উত্তরা দিয়াবাড়ি দুর্ঘটনা সহায়তা কেন্দ্র।",
  keywords: "মাইলস্টোন কলেজ বিমান দুর্ঘটনা, এয়ার ফোর্স জেট ক্র্যাশ, উত্তরা দিয়াবাড়ি, জরুরি রক্তদান, স্কিন ডোনেশন, নিখোঁজ ব্যক্তি, বাংলাদেশ বিমান বাহিনী, ঢাকা স্কুল দুর্ঘটনা, F-7 BGI, milestone college dhaka, bangladesh air force crash, uttara diabari accident",
  authors: [{ name: "Increments Inc.", url: "https://incrementsinc.com" }],
  creator: "Increments Inc.",
  publisher: "Increments Inc.",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  category: "Emergency Relief, Blood Donation, Medical Aid",
  classification: "Emergency Response, Disaster Relief, Medical Support",
  coverage: "Bangladesh, Dhaka, Uttara, Diabari",
  distribution: "global",
  rating: "general",
  referrer: "origin-when-cross-origin",
  other: {
    "news_keywords": "মাইলস্টোন কলেজ, বিমান দুর্ঘটনা, এয়ার ফোর্স, জেট ক্র্যাশ, রক্তদান, স্কিন ডোনেশন, নিখোঁজ",
    "article:section": "Emergency Response",
    "article:tag": "Bangladesh Air Force, Milestone College, Emergency Aid, Blood Donation, Skin Donation",
    "geo.region": "BD-13",
    "geo.placename": "Dhaka, Bangladesh",
    "geo.position": "23.8103;90.4125",
    "ICBM": "23.8103, 90.4125"
  },
  alternates: {
    canonical: "https://gienie.xyz"
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "মাইলস্টোন থ্রেড"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "মাইলস্টোন কলেজ দুর্ঘটনা সহায়তা",
    title: "মাইলস্টোন কলেজ বিমান দুর্ঘটনা সহায়তা - জরুরি রক্তদান ও স্কিন ডোনেশন",
    description: "মাইলস্টোন কলেজ এয়ার ফোর্স বিমান দুর্ঘটনার আহতদের জন্য জরুরি রক্তদান, স্কিন ডোনেশন ও নিখোঁজ ব্যক্তির খোঁজ। ঢাকা উত্তরা দিয়াবাড়ি।",
    url: "https://gienie.xyz",
    locale: "bn_BD",
    countryName: "Bangladesh",
    street: "Uttara, Diabari",
    locality: "Dhaka",
    region: "Dhaka Division",
    postalCode: "1230",
    latitude: 23.8103,
    longitude: 90.4125,
    images: [
      {
        url: "https://gienie.xyz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "মাইলস্টোন কলেজ বিমান দুর্ঘটনা সহায়তা - জরুরি রক্তদান ও স্কিন ডোনেশন",
        type: "image/jpeg"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "মাইলস্টোন কলেজ বিমান দুর্ঘটনা সহায়তা",
    description: "এয়ার ফোর্স জেট ক্র্যাশ আহতদের জন্য জরুরি রক্তদান, স্কিন ডোনেশন ও নিখোঁজ ব্যক্তির খোঁজ। ঢাকা উত্তরা দিয়াবাড়ি।",
    images: ["https://gienie.xyz/og-image.jpg"],
    creator: "@gienie"
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icons/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/icons/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" }
    ]
  }
};

export const viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
