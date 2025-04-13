import { SidebarContextProvider } from "@/context/sidebarContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description: "Have questions or feedback? We'd love to hear from you. Get in touch with our team and we will help you with our best solutions. Hironai best solution for your team to hire smart people.",
    generator: 'hironai.com',
    applicationName: 'Hiron AI',
    referrer: 'origin-when-cross-origin',
    keywords: ['Hiron AI', 'contact Hironai', 'Computer Science', 'Software Engineer', 'Ankit', 'Founder of Hiron AI', 'Hiron AI ceo', 'Hiring', 'Job', 'Linkedin jobs', 'open to work', 'job hiring', 'computer science', 'iit', 'jobs', 'linkedin', 'google', 'google jobs', "naukari", 'wellfound', 'shine', 'hironai'],
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
        canonical: '/contact',
        languages: {
            'en-US': '/en-US'
        },
    },
    openGraph: {
        title: "Contact",
        description: "Have questions or feedback? We'd love to hear from you. Get in touch with our team and we will help you with our best solutions. Hironai best solution for your team to hire smart people.",
        url: "https://hironai.com/contact",
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
