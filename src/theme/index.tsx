'use client';

import { ThemeProvider } from 'next-themes';
// import { Sidebar } from './layout/sidebar';
import { useState } from 'react';
// import { Header } from './layout/header';

export function Providers({ children }: { children: React.ReactNode }) {

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
        >
            <div className="min-h-screen">
                {/* <Sidebar /> */}
                <div className="max-w-auto">
                    {/* <Header
                        toggleMobileSearch={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                        isMobileSearchOpen={isMobileSearchOpen}
                    /> */}
                    <div className="pt-12 lg:pl-[280px]">
                        {/* <div className="pt-12 lg:pl-[280px] min-h-screen"> */}
                        <div className="mx-auto px-4 py-6">{children}</div>
                    </div>
                </div>
            </div>
            {/* <ScrollToTopButton visible={true} /> */}
        </ThemeProvider>
    );
}

