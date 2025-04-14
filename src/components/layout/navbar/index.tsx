"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, Rocket, ScanFace, SunDim, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "../logo";
import { ApplicationContext } from "@/context/applicationContext";
import { getDashboard_API } from "@/app/api/controller/dashboardController";
import { HttpStatusCode } from "axios";
import {toast} from "sonner";


export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userInfo, setUserInfo, setIsOrganization } = useContext(ApplicationContext);

      useEffect(() => {
        const fetchData = async () => {
          try {
              let response = await getDashboard_API();
    
              const status = response.status ?? 500;
              const responseData = response.data ?? {};
    
              if (status !== HttpStatusCode.Ok) {
                //   toast.info(responseData.error);
              }
              if (status === HttpStatusCode.Ok) {
    
                  // ✅ Set user info in the context
                  setUserInfo(responseData.dashboard);
    
                  // ✅ Update `isOrganization` based on user role
                  setIsOrganization(responseData.dashboard.user.role === "Organization");

              }
              
          } catch (error) {
              console.log(error);
          }
      };
    
      fetchData();
      }, []);
      

    return (
        <div className="w-full bg-primary/10">
            <nav className="py-4 px-4 md:px-6 max-w-7xl mx-auto flex items-center justify-between z-0">
                {/* <nav className="w-full py-4 px-4 md:px-8 lg:px-24 flex items-center justify-between z-0"> */}
                <div className="flex items-center gap-8">
                    <Logo />
                </div>

                <nav className="hidden lg:flex items-center gap-6">
                    <Link href="/about" className="text font-medium hover:text-primary transition-colors">
                        About
                    </Link>
                    <Link href="/templates" className="text font-medium hover:text-primary transition-colors">
                    Templates
                </Link>
                    {/* <Link href="/pricing" className="text font-medium hover:text-primary transition-colors">
                        Pricing
                    </Link> */}
                    <Link href="/contact" className="text font-medium hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                {
                    userInfo?.user ? 
                    <div className="hidden lg:flex items-center gap-4">
                    <Link href="/dashboard"><Button className="bg-primary text-white">Dashboard</Button></Link>
                    </div>
                    
                 :
                 <div className="hidden lg:flex items-center gap-4">
                    <Link href="/login"><Button variant="outline" className="">Get Hired</Button></Link>
                    <Link href="/register"><Button className="bg-primary text-white">Hire Now</Button></Link>
                </div>
                }
                

                {/* Mobile Menu Button */}
                <div className="lg:hidden text-primary">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-transparent"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <Rocket size={28} className="-rotate-[45deg]" /> : <ScanFace size={31} />}
                    </Button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            className="absolute top-16 left-0 right-0 bg-[#e7edeb] shadow-lg z-50 p-4 lg:hidden"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex flex-col gap-4 ">
                                <Link
                                    href="/about"
                                    className="font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link
                                href="/templates"
                                className="font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Templates
                            </Link>
                                {/* <Link
                                    href="/pricing"
                                    className="font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Pricing
                                </Link> */}
                                <Link
                                    href="/contact"
                                    className="font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Contact
                                </Link>

                               {
                                Boolean(userInfo?.user) ? 
                                <div className="flex flex-col gap-2 mt-4">
                                <Link href="/dashboard"><Button className="bg-primary text-white px-8 py-6 text-base w-full">Dashboard</Button></Link>
                                </div>
                            :
                            <div className="flex flex-col gap-2 mt-4">
                            <Link href="/login"><Button variant="outline" className="px-8 py-6 text-base w-full">Get Hired</Button></Link>
                            <Link href="/register"><Button className="bg-primary text-white px-8 py-6 text-base w-full">Hire Now</Button></Link>
                        </div>
                               }
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
}