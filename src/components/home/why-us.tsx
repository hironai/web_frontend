'use client'

import { motion } from 'framer-motion';
import { Users, Search, FileText, Building, Share2, Shield, Zap, MessageSquare, Plug } from 'lucide-react';

export default function WhyUs() {
    return (
        <section className="pt-16 md:py-16">
            <div className="px-4 md:px-6 mx-auto max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-medium mb-4">Everything You Need</h2>
                    <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                        Hiron AI provides a comprehensive platform for both job seekers and organizations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Professional Resume Builder",
                            description: "Create a comprehensive digital resume with all your professional details in one place.",
                            icon: FileText,
                            color: "bg-blue-100",
                            textColor: "text-blue-600"
                        },
                        {
                            title: "Powerful Search",
                            description: "Organizations can search for candidates using advanced filters and AI-powered matching.",
                            icon: Search,
                            color: "bg-green-100",
                            textColor: "text-green-600"
                        },
                        {
                            title: "Employee Management",
                            description: "Organizations can upload and manage employee profiles in bulk with easy-to-use tools.",
                            icon: Users,
                            color: "bg-yellow-100",
                            textColor: "text-yellow-600"
                        },
                        {
                            title: "Organization Verification",
                            description: "Verified organizations gain enhanced trust and visibility in the platform.",
                            icon: Building,
                            color: "bg-purple-100",
                            textColor: "text-purple-600"
                        },
                        {
                            title: "Shareable Templates",
                            description: "Choose from multiple resume templates and share them directly with potential employers.",
                            icon: Share2,
                            color: "bg-pink-100",
                            textColor: "text-pink-600"
                        },
                        {
                            title: "Privacy Controls",
                            description: "Control who can see your information with granular privacy settings.",
                            icon: Shield,
                            color: "bg-red-100",
                            textColor: "text-red-600"
                        },
                        {
                            title: "Real-time Updates",
                            description: "Update your information once and see it reflected across all your resume templates.",
                            icon: Zap,
                            color: "bg-indigo-100",
                            textColor: "text-indigo-600"
                        },
                        {
                            title: "AI-Powered Matching",
                            description: "Describe your requirements in natural language and find the perfect candidates.",
                            icon: MessageSquare,
                            color: "bg-teal-100",
                            textColor: "text-teal-600"
                        },
                        {
                            title: "Seamless Integration",
                            description: "Easily integrate with third-party tools and APIs to enhance your workflow.",
                            icon: Plug,
                            color: "bg-cyan-100",
                            textColor: "text-cyan-600"
                        }

                    ]
.map((feature, index) => (
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
    );
}