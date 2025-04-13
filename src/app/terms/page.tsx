"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow py-12">
                <div className="container px-4 md:px-6 mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-medium tracking-tight mb-4">Terms of Service</h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: March 05, 2025
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">Agreement to Terms</h2>
                                <p className="mb-4">
                                    These Terms of Service constitute a legally binding agreement made between you and Hiron AI. By accessing or using our website, you agree to be bound by these Terms of Service.
                                </p>
                                <p>
                                    If you disagree with any part of these terms, then you may not access our website or use our services.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">User Accounts</h2>
                                <div className="space-y-4">
                                    <p>
                                        When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                                    </p>
                                    <p>
                                        You are responsible for safeguarding the password that you use to access our services and for any activities or actions under your password.
                                    </p>
                                    <p>
                                        You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">Intellectual Property</h2>
                                <div className="space-y-4">
                                    <p>
                                        The Service and its original content, features, and functionality are and will remain the exclusive property of Hiron AI and its licensors.
                                    </p>
                                    <p>
                                        Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Hiron AI.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">User Content</h2>
                                <div className="space-y-4">
                                    <p>
                                        Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content").
                                    </p>
                                    <p>
                                        You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
                                    </p>
                                    <p>
                                        By posting Content on or through the Service, you represent and warrant that:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>The Content is yours and/or you have the right to use it</li>
                                        <li>The Content does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person or entity</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">Prohibited Uses</h2>
                                <p className="mb-4">You agree not to use the Service:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>In any way that violates any applicable law or regulation</li>
                                    <li>To impersonate or attempt to impersonate another person or entity</li>
                                    <li>To engage in any conduct that restricts or inhibits anyone's use of the Service</li>
                                    <li>To attempt to gain unauthorized access to any portion of the Service</li>
                                    <li>To harass, abuse, or harm another person</li>
                                    <li>For any obscene or immoral purpose</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">Termination</h2>
                                <div className="space-y-4">
                                    <p>
                                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                                    </p>
                                    <p>
                                        Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">Limitation of Liability</h2>
                                <div className="space-y-4">
                                    <p>
                                        In no event shall Hiron AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
                                    </p>
                                    <p>
                                        Some jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, so the above limitation may not apply to you.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">Changes to Terms</h2>
                                <p>
                                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-medium mb-4">Contact Us</h2>
                                <p className="mb-4">
                                    If you have any questions about these Terms, please contact us at:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Email: legal@hironai.com</li>
                                    <li>Phone: (+44) 7584 470579</li>
                                    <li>Address: Buckingham Palace Road, London SW1W 9SR, United Kingdom</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}