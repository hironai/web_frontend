import { SidebarContextProvider } from "@/context/sidebarContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Templates",
    description: "Choose from our collection of professionally designed resume templates to showcase your skills and experience. No need to create multiple resumes, provide your basic information, rest is on us to server you best in class templates.",
    generator: 'hironai.com',
    applicationName: 'Hiron AI',
    referrer: 'origin-when-cross-origin',
    keywords: ['Hiron AI', 'Hiron AI Templates', 'Computer Science', 'Software Engineer', 'Ankit', 'Founder of Hiron AI', 'Hiron AI ceo', 'Hiring', 'Job', 'Linkedin jobs', 'open to work', 'job hiring', 'computer science', 'iit', 'jobs', 'linkedin', 'google', 'google jobs', "naukari", 'wellfound', 'shine', 'hironai'],
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
        canonical: '/templates',
        languages: {
            'en-US': '/en-US'
        },
    },
    openGraph: {
        title: "Templates",
        description: "Choose from our collection of professionally designed resume templates to showcase your skills and experience. No need to create multiple resumes, provide your basic information, rest is on us to server you best in class templates.",
        url: "https://hironai.com/about",
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
