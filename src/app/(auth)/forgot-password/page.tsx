'use client'

import ForgotPasswordPage from "@/components/auth/forgot-password"
import ResetPasswordPage from "@/components/auth/reset-password"
import VerifyOTPPage from "@/components/auth/verify-otp"
import { ApplicationContext } from "@/context/applicationContext"
import { useContext } from "react"


export default function ForgotPassword() {
    return (
         <div className="min-h-screen flex flex-col">
                    <main className="flex-grow py-12 md:py-20">
                        <div className="px-4 md:px-6 mx-auto max-w-7xl">
                    <ForgotNavigation />
                           
                        </div>
                    </main>
                </div>
    )
}

const ForgotNavigation = () => {
    const { forgotNav, setForgotNav } = useContext(ApplicationContext)

    switch (forgotNav) {
        case 0:
            return <ForgotPasswordPage />
        case 1:
            return <VerifyOTPPage setNavigation={setForgotNav} />
        case 2:
            return <ResetPasswordPage />
        default:
            <ForgotPasswordPage />
    }
}