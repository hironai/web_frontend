import React from 'react';
import { Link2 } from 'lucide-react';
import Image from 'next/image';
import { GoogleFonts } from '@/fonts';
import Link from 'next/link';

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <Link href="/" className="flex flex-wrap items-center gap-2">
            <div className="h-9 w-9 rounded-md flex items-center justify-center">
                <Image
                    src="/assets/images/logo/logo.svg"
                    alt='Hiron AI'
                    height={50}
                    width={50}
                    className='h-12 w-12'
                />
            </div>
            <span className={`text-[26px] ${GoogleFonts.jura.className} font-extrabold text-custom-cta ${className} text-primary`}>Hiron AI</span>
            {/* <span className={`text-2xl ${GoogleFonts.jura.className} font-extrabold text-custom-cta ${className}`}>Hiron AI</span> */}
        </Link>
    );
}