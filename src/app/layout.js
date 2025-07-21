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
  title: "রক্তদাতা তালিকা - জরুরি রক্তের প্রয়োজনে",
  description: "মাইলস্টোন কলেজ দুর্ঘটনার জন্য জরুরি রক্তদান। দ্রুত রক্তদাতা খুঁজুন এবং যোগাযোগ করুন। একসাথে জীবন বাঁচান।",
  keywords: "রক্তদান, জরুরি রক্ত, মাইলস্টোন কলেজ, বিমান দুর্ঘটনা, রক্তদাতা, ঢাকা, বাংলাদেশ",
  authors: [{ name: "Increments Inc.", url: "https://incrementsinc.com" }],
  creator: "Increments Inc.",
  publisher: "Increments Inc.",
  robots: "index, follow",
  alternates: {
    canonical: "https://gienie.xyz"
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "রক্তদাতা তালিকা"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "রক্তদাতা তালিকা",
    title: "জরুরি রক্তদান - মাইলস্টোন কলেজ দুর্ঘটনা",
    description: "মাইলস্টোন কলেজ বিমান দুর্ঘটনার আহতদের জন্য জরুরি রক্তদান। দ্রুত রক্তদাতা খুঁজুন এবং জীবন বাঁচাতে সাহায্য করুন।",
    url: "https://gienie.xyz",
    images: [
      {
        url: "https://gienie.xyz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "জরুরি রক্তদান - মাইলস্টোন কলেজ দুর্ঘটনার আহতদের জন্য"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "জরুরি রক্তদান - মাইলস্টোন কলেজ",
    description: "বিমান দুর্ঘটনার আহতদের জন্য জরুরি রক্তদান প্রয়োজন। রক্তদাতা খুঁজুন এবং জীবন বাঁচান।",
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
