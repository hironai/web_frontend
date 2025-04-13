"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="w-full py-16 md:py-24 bg-custom-cta text-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 md:mb-0"
                    >
                        <h2 className="text-3xl md:text-5xl font-medium">
                            Discover the full scale of
                            <br />
                            <span className="relative inline-block">
                                Clock capabilities
                                <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-primary"></span>
                                {/* <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-custom-sectionbg"></span> */}
                            </span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link href="register">
                            <Button
                                variant="outline"
                                className="bg-white text-[#1A2A29] hover:bg-white/90 rounded-lg px-6 py-4 h-auto text-base font-medium w-full md:w-auto"
                            >
                                Join as a Professional
                            </Button>
                        </Link>
                        <Link href="register?type=organization">
                            <Button
                                className="bg-primary text-white hover:bg-primary/90 rounded-lg px-6 py-4 h-auto text-base font-medium w-full md:w-auto"
                                // className="bg-[#D6FF47] text-[#1A2A29] hover:bg-[#D6FF47]/90 rounded-lg px-6 py-4 h-auto text-base font-medium w-full md:w-auto"
                            >
                                Register Your Organization
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}