"use client";

import { useState } from 'react';
import LoginComponent from '@/components/auth/login';
import VerifyOTPPage from '@/components/auth/verify-otp';
import ResetPasswordPage from '@/components/auth/reset-password';

export default function Login() {
    const [loginNav, setLoginNav] = useState(0)
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow py-12 md:py-20">
                <div className="px-4 md:px-6 mx-auto max-w-7xl">
                    <NavLogin loginNav={loginNav} setLoginNav={setLoginNav} />
                </div>
            </main>
        </div>
    );
}

const NavLogin = ({ loginNav, setLoginNav } :any) => {
  
    switch (loginNav) {
        case 0:
            return <LoginComponent setNavigation={setLoginNav} />
        case 1:
            return <VerifyOTPPage setNavigation={setLoginNav} />
        case 2:
            return <ResetPasswordPage setNavigation={setLoginNav}/>
        default:
            return <LoginComponent setNavigation={setLoginNav} />
    }
}

