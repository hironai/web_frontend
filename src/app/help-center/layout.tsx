import { SidebarContextProvider } from "@/context/sidebarContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Help Center",
    description: "Find answers fast and get the support you need with the Hiron AI Help Center. Whether you're a job seeker or employer, explore guides, FAQs, and step-by-step solutions—clear, reliable, and always here to help you succeed.",
    generator: 'hironai.com',
    applicationName: 'Hiron AI',
    referrer: 'origin-when-cross-origin',
    keywords: ['Hiron AI', 'Help Center', 'Hiron AI Help Center', 'Computer Science', 'Software Engineer', 'Ankit', 'Founder of Hiron AI', 'Hiron AI ceo', 'Hiring', 'Job', 'Linkedin jobs', 'open to work', 'job hiring', 'computer science', 'iit', 'jobs', 'linkedin', 'google', 'google jobs', "naukari", 'wellfound', 'shine', 'hironai'],
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
        canonical: '/help-center',
        languages: {
            'en-US': '/en-US'
        },
    },
    openGraph: {
        title: "Help Center",
        description: "Find answers fast and get the support you need with the Hiron AI Help Center. Whether you're a job seeker or employer, explore guides, FAQs, and step-by-step solutions—clear, reliable, and always here to help you succeed.",
        url: "https://hironai.com/help-center",
        type: "website",
        images: [
            {
                url: "https://hironai.com/assets/images/social/home_banner.png", // Use an absolute URL
                width: 1200,
                height: 630,
                alt: "Dashboard"
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
        <SidebarContextProvider>
            {children}
        </SidebarContextProvider>
    );
}
