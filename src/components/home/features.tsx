'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock, Users, Building2, GraduationCap, Search } from 'lucide-react';
import Image from 'next/image';

export default function Features() {
    return (
        <div className='md:px-0 px-1'>
            {/* <div className="overflow-x-hidden"> */}

            {/* Features Section */}
            <section className="pt-0 md:py-16">
                <div className="px-4 md:px-6 mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-medium mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                            Hiron AI simplifies the connection between talent and opportunity
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Create Your Profile",
                                description: "Build your comprehensive professional profile with all your skills, experience, and achievements.",
                                icon: Users,
                                color: "bg-blue-100 dark:bg-blue-900/20",
                                textColor: "text-blue-600 dark:text-blue-400"
                            },
                            {
                                title: "Choose Templates",
                                description: "Select from our library of professional resume templates to showcase your experience.",
                                icon: Clock,
                                color: "bg-purple-100 dark:bg-purple-900/20",
                                textColor: "text-purple-600 dark:text-purple-400"
                            },
                            {
                                title: "Get Discovered",
                                description: "Organizations search our database to find candidates that match their requirements.",
                                icon: Search,
                                color: "bg-green-100 dark:bg-green-900/20",
                                textColor: "text-green-600 dark:text-green-400"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center p-6 rounded-xl border bg-card"
                            >
                                <div className={`p-4 rounded-full ${feature.color} mb-4`}>
                                    <feature.icon className={`h-8 w-8 ${feature.textColor}`} />
                                </div>
                                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Job Seekers Section */}
            <section className="pt-16 md:py-24 bg-secondary/20">
                <div className="px-4 md:px-6 mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="order-2 md:order-1"
                        >
                            <div className="overflow-hidden w-full h-full">
                                <Image src="/assets/images/home/candidate_dashboard.svg" className='bg-cover w-full h-full' alt='Candidate Dashboard' width={100} height={100} />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="order-1 md:order-2"
                        >
                            <h2 className="text-3xl md:text-4xl font-medium mb-4">For Job Seekers</h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Create a comprehensive profile that showcases your skills and experience to potential employers.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Build a detailed professional profile",
                                    "Choose from multiple resume templates",
                                    "Share your profile with potential employers",
                                    "Update your information once, reflect everywhere",
                                    "Get discovered by organizations worldwide"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="mr-2 mt-1 bg-primary/10 text-primary rounded-full p-1">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button asChild className="mt-8">
                                <Link href="/register?type=candidate">Create Your Profile</Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* For Organizations Section */}
            <section className="pt-16 md:py-24">
                <div className="px-4 md:px-6 mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-medium mb-4">For Organizations</h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Find the perfect candidates for your positions by searching our comprehensive database.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Search our global database of professionals",
                                    "Upload your existing employee database",
                                    "Invite employees to create profiles",
                                    "Use AI-powered search to find the perfect match",
                                    "Track invitations and registrations"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="mr-2 mt-1 bg-primary/10 text-primary rounded-full p-1">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button asChild className="mt-8">
                                <Link href="/register?type=organization">Register Your Organization</Link>
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="overflow-hidden w-full h-full">
                                <Image src="/assets/images/home/organization_dashboard.svg" className='bg-cover w-full h-full' alt='Candidate Dashboard' width={100} height={100} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}