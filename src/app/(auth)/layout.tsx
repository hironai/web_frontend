import { SidebarContextProvider } from "@/context/sidebarContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Join Hiron AI",
    description: "Connecting talent with opportunities worldwide. Whether you're looking for your next role or your next hire, Hiron AI brings everyone together.",
    generator: 'hironai.com',
    applicationName: 'Hiron AI',
    referrer: 'origin-when-cross-origin',
    keywords: ['Hiron AI', 'Hiron AI Dashboard', 'Computer Science', 'Software Engineer', 'Ankit', 'Founder of Hiron AI', 'Hiron AI ceo', 'Hiring', 'Job', 'Linkedin jobs', 'open to work', 'job hiring', 'computer science', 'iit', 'jobs', 'linkedin', 'google', 'google jobs', "naukari", 'wellfound', 'shine', 'hironai'],
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
        canonical: '/login',
        languages: {
            'en-US': '/en-US'
        },
    },
    openGraph: {
        title: "Join Hiron AI",
        description: "Connecting talent with opportunities worldwide. Whether you're looking for your next role or your next hire, Hiron AI brings everyone together.",
        url: "https://hironai.com/login",
        type: "website",
        images: [
            {
                url: "https://hironai.com/assets/images/social/home_banner.png", // Use an absolute URL
                width: 1200,
                height: 630,
                alt: "Auth"
            }
        ]
    }

};

// ✅ Export viewport separately
export const viewport = {
    themeColor: "#e7edeb",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-b from-primary/10 to-white">      
        {/* Scrollable content */}
        <div className="h-full overflow-auto grid-background" id="hide-scrollbar">
          <SidebarContextProvider>{children}</SidebarContextProvider>
        </div>
      </div>
    );
}
