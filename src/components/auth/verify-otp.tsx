"use client";

import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { ApplicationContext } from '@/context/applicationContext';
import { resendOTP_API, verifyOTP_API } from '@/app/api/controller/userController';
import { HttpStatusCode } from 'axios';
import { toast } from "sonner";
import { usePathname, useRouter } from 'next/navigation';

export default function VerifyOTPPage({ setNavigation }: any) {
  const { email, setForgotNav } = useContext(ApplicationContext)
  const pathName = usePathname()?.split('/')[1]
  const route = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    console.log("in");
    if (otpString.length !== 6) return;
  
    setIsVerifying(true);
    try {
      let response = await verifyOTP_API({ email, "otp": parseInt(otpString), type: pathName })
      
      const status = response.status ?? 500;
      const responseData = response.data ?? {};

      if (status !== HttpStatusCode.Ok) {
        toast.info(responseData.error ? responseData.error : responseData.errors[0].message);
        setIsVerifying(false);
      }
      if (status === HttpStatusCode.Ok) {
        toast.info(responseData.message);
        setIsVerifying(false);
        if (pathName === 'login') {
          !responseData?.isPasswordSet ? setNavigation(2) : route.push('dashboard')
        }
        else {
          setForgotNav(2)
        }
      }
    }

    catch (error) {
    console.log(error)
  }
  // Simulate verification
  setTimeout(() => {
    setIsVerifying(false);
    // Handle verification success/failure
  }, 1500);
};

const handleResend = () => {
  setResendDisabled(true);
  let timer = 30;

  const countdown = setInterval(() => {
    timer--;
    setResendTimer(timer);

    if (timer === 0) {
      clearInterval(countdown);
      setResendDisabled(false);
    }
  }, 1000);

  // Simulate resend OTP
  console.log('Resending OTP...');
};

const resendOtp = async () => {
  try {
    let response = await resendOTP_API({ email });

    const status = response.status ?? 500;
    const responseData = response.data ?? {};

    if (status !== HttpStatusCode.Ok) {
      toast.info(responseData.error);
    }
    if (status === HttpStatusCode.Ok) {
      toast.info(responseData.message);
      // ✅ Update `searchResults` state
      handleResend()

    }

  } catch (error) {
    console.error("Error fetching employees:", error);
  }
}
return (
  <>
    {/* <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-medium tracking-tight mb-2">Verify Your Email</h1>
        <p className="text-lg text-muted-foreground">
          We've sent a verification code to your email address
        </p>
      </motion.div>

    </div> */}

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-md mx-auto"
    >
      <Card>
        <CardHeader className='text-center'>
          <div className="flex justify-center mb-4">
            <KeyRound className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Enter Verification Code</CardTitle>
          <CardDescription>
            Please enter the 6-digit code we sent to {email[0]}***{email?.split('@')[1]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg"
              />
            ))}
          </div>

          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={otp.join('').length !== 6 || isVerifying}
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Verify Code
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Didn't receive the code?{" "}
            <button
              onClick={resendOtp}
              disabled={resendDisabled}
              className="text-primary hover:underline disabled:opacity-50 disabled:hover:no-underline"
            >
              Resend
              {resendDisabled && ` (${resendTimer}s)`}
            </button>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Having trouble?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  </>
);
}
