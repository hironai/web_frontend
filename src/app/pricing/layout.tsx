import { SidebarContextProvider } from "@/context/sidebarContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing",
    description: "Flexible and transparent pricing for every hiring need. With Hiron AI, access top talent or your next opportunity without hidden costs—seamless, efficient, and built for success.",
    generator: 'hironai.com',
    applicationName: 'Hiron AI',
    referrer: 'origin-when-cross-origin',
    keywords: ['Hiron AI', 'Hiron AI pricing', 'Computer Science', 'Software Engineer', 'Ankit', 'Founder of Hiron AI', 'Hiron AI ceo', 'Hiring', 'Job', 'Linkedin jobs', 'open to work', 'job hiring', 'computer science', 'iit', 'jobs', 'linkedin', 'google', 'google jobs', "naukari", 'wellfound', 'shine', 'hironai'],
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
        canonical: '/pricing',
        languages: {
            'en-US': '/en-US'
        },
    },
    openGraph: {
        title: "Pricing",
        description: "Flexible and transparent pricing for every hiring need. With Hiron AI, access top talent or your next opportunity without hidden costs—seamless, efficient, and built for success.",
        url: "https://hironai.com/pricing",
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
