import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWAProvider } from "@/components/PWAProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Milestone Thread",
  description: "Track your milestones and achievements in a beautiful timeline",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Milestone Thread"
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: "website",
    siteName: "Milestone Thread",
    title: "Milestone Thread",
    description: "Track your milestones and achievements in a beautiful timeline"
  },
  twitter: {
    card: "summary",
    title: "Milestone Thread",
    description: "Track your milestones and achievements in a beautiful timeline"
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
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
