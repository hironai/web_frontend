"use client";

import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Clock, ArrowRight, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setResetPassword_API } from '@/app/api/controller/userController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { ApplicationContext } from '@/context/applicationContext';
import { usePathname, useRouter } from 'next/navigation';

// Validation schema
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function ResetPasswordPage({setNavigation}:any) {
const {email,setForgotNav,setEmail} = useContext(ApplicationContext)
  const pathName = usePathname()?.split('/')[1]

const route = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });
  
  const onSubmit = async(data: any) => {
    setIsSubmitting(true);
    
    try {
      let response = await setResetPassword_API({ ...data, email});

      // ✅ Ensure status is always a number by using fallback (e.g., 500)
      const status = response.status ?? 500;
      const responseData = response.data ?? {};

      if (status !== HttpStatusCode.Ok) {
          toast.info(responseData.error);
      }
      if (status === HttpStatusCode.Ok) {
          toast.info(responseData.message);
          setEmail(data.email)
          if(pathName === 'login'){
            route.push('dashboard')
            setNavigation(0)

          }
          else{
            route.push('login')
            setForgotNav(0)

          }
      }
    
  } catch (error) {
      console.log(error);
  }
  };

  const handleLogin = ()=>{
    route.push('login')
    setForgotNav(0)
    setNavigation(0)
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
      <h1 className="text-3xl font-medium tracking-tight mb-2">Reset Your Password</h1>
      <p className="text-lg text-muted-foreground">
        Create a new password for your account
      </p>
    </motion.div>
  </div> */}

      <motion.div
      initial ={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="max-w-md mx-auto"
    >
      <Card>
        {isSubmitted ? (
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="rounded-full bg-primary/10 dark:bg-green-900/30 p-3 mb-4">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-2">Password Reset Complete</h3>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Button asChild className="w-full">
                <Link href="/login">
                  Continue to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className='text-center'>
            <div className="flex justify-center mb-4">
                            <Lock className="h-12 w-12 text-primary" />
                        </div>
              <CardTitle>Create New Password</CardTitle>
              <CardDescription>
                Please enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder='***********'
                    className="pl-9 pr-10"
                    {...form.register("password")} 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword" 
                    placeholder='***********'
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-9 pr-10"
                    {...form.register("confirmPassword")} 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-medium">Password Requirements:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>At least 8 characters long</li>
                  <li>Contains at least one uppercase letter</li>
                  <li>Contains at least one lowercase letter</li>
                  <li>Contains at least one number</li>
                </ul>
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
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Reset Password
                  </>
                )}
              </Button>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-center flex justify-center gap-1 flex-wrap text-muted-foreground w-full">
                <p>
                Remember your password?{" "}

                </p>
                <p onClick={handleLogin} className="text-primary hover:underline cursor-pointer">
                  Log in
                </p>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </motion.div>
    </>
  );
}