"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section className="py-16 md:py-24 bg-[#1A2A29] text-primary-foreground">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-medium mb-4">Join the Hiron AI Community</h2>
                    <p className="text-lg opacity-90 max-w-[800px] mx-auto mb-8">
                        Whether you're a professional looking to showcase your skills or an organization searching for talent, Hiron AI is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary" className="font-medium">
                            <Link href="/register?type=candidate">Create Your Profile</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-white">
                            <Link href="/contact">
                                Contact Us
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}