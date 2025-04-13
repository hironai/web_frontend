"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
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
                        <h1 className="text-4xl font-medium tracking-tight mb-4">Privacy Policy</h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: March 05, 2024
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                                <div className="space-y-4">
                                    <p>
                                        We collect information that you provide directly to us when you:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Create an account</li>
                                        <li>Update your profile</li>
                                        <li>Upload your resume</li>
                                        <li>Apply for jobs</li>
                                        <li>Contact our support team</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                                <div className="space-y-4">
                                    <p>
                                        We use the information we collect to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Provide and maintain our services</li>
                                        <li>Process your job applications</li>
                                        <li>Match you with potential employers</li>
                                        <li>Send you important updates and notifications</li>
                                        <li>Improve our services and develop new features</li>
                                        <li>Protect against fraud and abuse</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
                                <div className="space-y-4">
                                    <p>
                                        We share your information with:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Employers when you apply for their jobs</li>
                                        <li>Service providers who assist in our operations</li>
                                        <li>Law enforcement when required by law</li>
                                    </ul>
                                    <p>
                                        We do not sell your personal information to third parties.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                                <div className="space-y-4">
                                    <p>
                                        We implement appropriate security measures to protect your personal information, including:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Encryption of data in transit and at rest</li>
                                        <li>Regular security assessments</li>
                                        <li>Access controls and authentication</li>
                                        <li>Employee training on data protection</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
                                <div className="space-y-4">
                                    <p>
                                        You have the right to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Access your personal information</li>
                                        <li>Correct inaccurate information</li>
                                        <li>Delete your account and data</li>
                                        <li>Object to processing of your information</li>
                                        <li>Export your data</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
                                <div className="space-y-4">
                                    <p>
                                        We use cookies and similar tracking technologies to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Remember your preferences</li>
                                        <li>Analyze site usage</li>
                                        <li>Personalize content</li>
                                        <li>Improve our services</li>
                                    </ul>
                                    <p>
                                        You can control cookie settings through your browser preferences.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                                <p>
                                    Our services are not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Changes to Privacy Policy</h2>
                                <p>
                                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                                <p className="mb-4">
                                    If you have any questions about this Privacy Policy, please contact us at:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Email: privacy@hironai.com</li>
                                    <li>Phone: +1 (555) 123-4567</li>
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