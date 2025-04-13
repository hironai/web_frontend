"use client";

import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Clock, ArrowRight, Mail, CheckCircle2, Lock, MailIcon } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resendOTP_API } from '@/app/api/controller/userController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { ApplicationContext } from '@/context/applicationContext';
import { useRouter } from 'next/navigation';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordPage() {
  const {setEmail,setForgotNav} = useContext(ApplicationContext)
  const route = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  });
  
  const onSubmit = async(data: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    console.log("Reset password email submitted:", data);
    try {
      let response = await resendOTP_API({ ...data });
      console.log(response, "resp");

      // ✅ Ensure status is always a number by using fallback (e.g., 500)
      const status = response.status ?? 500;
      const responseData = response.data ?? {};

      if (status !== HttpStatusCode.Ok) {
          toast.info(responseData.error);
      }
      if (status === HttpStatusCode.Ok) {
          toast.info(responseData.message);
          setEmail(data.email)
          setForgotNav(1)
      }
      setIsSubmitting(false);
    
  } catch (error) {
      console.log(error);
  }
    // Simulate API call
   
  };

  return (
    <>
          {/* <div className="flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-medium tracking-tight mb-2">Reset Your Password</h1>
          <p className="text-lg text-muted-foreground">
            Enter your email address and we'll send you instructions to reset your password
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
            {isSubmitted ? (
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-medium mb-2">Check Your Email</h3>
                  <p className="text-muted-foreground mb-6">
                    We've sent password reset instructions to your email address. Please check your inbox.
                  </p>
                  <div className="space-y-4 w-full">
                    <Button asChild className="w-full">
                      <Link href="/login">
                        Return to Login
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Try Another Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader className='text-center'>
                <MailIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle>Forgot Password</CardTitle>
                  <CardDescription>
                    Enter your email address to receive password reset instructions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com"
                        className="pl-9"
                        {...form.register("email")} 
                      />
                    </div>
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Instructions...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Instructions
                      </>
                    )}
                  </Button>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <p className="text-sm text-center text-muted-foreground">
                    Remember your password?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Log in
                    </Link>
                  </p>
                  <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </form>
            )}
          </Card>
        </motion.div>
    </>
  );
}