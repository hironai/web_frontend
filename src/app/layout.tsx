import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/scroll.css";
import "@/styles/shadow.css";
import "@/styles/animation.css";
import { GoogleFonts } from "@/fonts";
import { NavContextProvider } from "@/context/navContext";
// import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/next"
import { InstallPrompt } from "@/components/ui/InstallPrompt";
import { Toaster } from 'sonner';
import { GoogleAnalytics } from '@next/third-parties/google'
import { GoogleTagManager } from '@next/third-parties/google'
import ApplicationContextProvider from "@/context/applicationContext";
import MicrosoftClarity from "./metrics/MicrosoftClarity";

export const metadata: Metadata = {
  title: "Hiron AI",
  description: "Connecting talent with opportunities worldwide. Whether you're looking for your next role or your next hire, Hiron AI brings everyone together.",
  generator: 'hironai.com',
  applicationName: 'Hiron AI',
  referrer: 'origin-when-cross-origin',
  keywords: ['Hiron AI', 'Computer Science', 'Software Engineer', 'Ankit', 'Founder of Hiron AI', 'Hiron AI ceo', 'Hiring', 'Job', 'Linkedin jobs', 'open to work', 'job hiring', 'computer science', 'iit', 'mit', 'stanford', 'it jobs', 'faang', 'maang', 'jobs', 'linkedin', 'google', 'google jobs', "naukari", 'wellfound', 'shine', 'hironai'],
  authors: [{ name: 'Ankit Kumar', url: 'https://hironai.com' }],
  creator: 'Ankit Kumar',
  publisher: 'Ankit Kumar',
  metadataBase: new URL('https://hironai.com'),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hiron AI',
  },
  icons: {
    icon: '/icon.svg',
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US'
    },
  },
  openGraph: {
    title: "Hiron AI",
    description: "Connecting talent with opportunities worldwide. Whether you're looking for your next role or your next hire, Hiron AI brings everyone together.",
    url: "https://hironai.com",
    type: "website",
    images: [
      {
        url: "https://hironai.com/assets/images/social/home_banner.png", // Use an absolute URL
        width: 1200,
        height: 630,
        alt: "Hiron AI"
      }
    ]
  }

};

// ✅ Export viewport separately
export const viewport = {
  themeColor: "#e7edeb",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${GoogleFonts.inter.className} antialiased min-h-screen bg-white`} style={{ scrollBehavior: 'smooth' }}
        id="gray_scroll"
      >
        <ApplicationContextProvider>
        <NavContextProvider>
          {children}
          <GoogleAnalytics 
          gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`} 
          />
          <GoogleTagManager 
          gtmId={`${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}`} 
          />
          <MicrosoftClarity />
          <Toaster />
          <InstallPrompt />
          {/* <Analytics />
          <SpeedInsights /> */}
        </NavContextProvider>
        </ApplicationContextProvider>
      </body>
    </html>
  );
}
