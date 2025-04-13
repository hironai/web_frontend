"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Check, X, Clock, Building2, User, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function PricingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="py-12 bg-gradient-to-b from-primary/10 to-white">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center max-w-3xl mx-auto"
                        >
                            <h1 className="text-4xl font-medium tracking-tighter mb-6">
                                Simple, Transparent Pricing
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                Choose the plan that's right for you or your organization. No hidden fees, no surprises.
                            </p>
                            <div className="flex flex-wrap w-full justify-center gap-4">
                                <Button asChild size="lg" variant="outline" className='w-full md:w-auto'>
                                    <a href="#individual">For Individuals</a>
                                </Button>
                                <Button asChild size="lg" className='w-full md:w-auto'>
                                    <a href="#organization">For Organizations</a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Individual Plans */}
                <section id="individual" className="py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            // whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-medium mb-4">For Individuals</h2>
                            <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                                Whether you're actively job hunting or just keeping your options open, we have a plan for you.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Free",
                                    price: "$0",
                                    description: "Perfect for getting started",
                                    features: [
                                        "Create a complete profile",
                                        "Access to 5 free templates",
                                        "Share your profile with unlimited links",
                                        "Basic analytics",
                                        "Email support"
                                    ],
                                    limitations: [
                                        "No premium templates",
                                        "Limited profile visibility in searches",
                                        "Standard support only"
                                    ],
                                    cta: "Get Started",
                                    popular: false
                                },
                                {
                                    name: "Professional",
                                    price: "$9.99",
                                    period: "per month",
                                    description: "For serious job seekers",
                                    features: [
                                        "Everything in Free",
                                        "Access to all templates (including premium)",
                                        "Priority in search results",
                                        "Advanced analytics",
                                        "Priority email support",
                                        "Profile highlights and badges",
                                        "Custom domain for your profile"
                                    ],
                                    limitations: [],
                                    cta: "Upgrade Now",
                                    popular: true
                                },
                                {
                                    name: "Lifetime",
                                    price: "$199",
                                    description: "One-time payment, lifetime access",
                                    features: [
                                        "Everything in Professional",
                                        "Lifetime access to all current and future templates",
                                        "Highest priority in search results",
                                        "Premium profile badges",
                                        "Phone support",
                                        "Early access to new features"
                                    ],
                                    limitations: [],
                                    cta: "Get Lifetime Access",
                                    popular: false
                                }
                            ].map((plan, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    // whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex"
                                >
                                    <Card className={`flex flex-col w-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                                {plan.popular && (
                                                    <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-baseline mt-2">
                                                <span className="text-3xl font-medium">{plan.price}</span>
                                                {plan.period && (
                                                    <span className="ml-1 text-muted-foreground">{plan.period}</span>
                                                )}
                                            </div>
                                            <CardDescription>{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-medium">What's included:</h4>
                                                <ul className="space-y-2">
                                                    {plan.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                                                            <span className="text-sm">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {plan.limitations.length > 0 && (
                                                    <>
                                                        <h4 className="text-sm font-medium mt-4">Limitations:</h4>
                                                        <ul className="space-y-2">
                                                            {plan.limitations.map((limitation, i) => (
                                                                <li key={i} className="flex items-start">
                                                                    <X className="h-4 w-4 text-muted-foreground mr-2 mt-1" />
                                                                    <span className="text-sm text-muted-foreground">{limitation}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                asChild
                                                className="w-full"
                                                variant={plan.popular ? "default" : "outline"}
                                            >
                                                <Link href="/register?type=candidate&plan=professional">
                                                    {plan.cta}
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Organization Plans */}
                <section id="organization" className="py-16 md:py-24 bg-secondary/20">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-medium mb-4">For Organizations</h2>
                            <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                                Find the perfect candidates for your positions with our powerful search and AI tools.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Starter",
                                    price: "$0",
                                    description: "For small teams and startups",
                                    features: [
                                        "Upload unlimited employees",
                                        "20 regular searches per day",
                                        "10 AI-powered searches per day",
                                        "Basic analytics",
                                        "Email support"
                                    ],
                                    limitations: [
                                        "Limited search filters",
                                        "No bulk invitations",
                                        "Standard support only"
                                    ],
                                    cta: "Get Started",
                                    popular: false
                                },
                                {
                                    name: "Business",
                                    price: "$99",
                                    period: "per month",
                                    description: "For growing organizations",
                                    features: [
                                        "Everything in Starter",
                                        "Unlimited regular searches",
                                        "50 AI-powered searches per day",
                                        "Advanced search filters",
                                        "Bulk employee invitations",
                                        "Priority support",
                                        "Detailed analytics dashboard",
                                        "Candidate shortlisting"
                                    ],
                                    limitations: [],
                                    cta: "Upgrade Now",
                                    popular: true
                                },
                                {
                                    name: "Enterprise",
                                    price: "Custom",
                                    description: "For large organizations",
                                    features: [
                                        "Everything in Business",
                                        "Unlimited AI-powered searches",
                                        "Custom integration with your ATS",
                                        "Dedicated account manager",
                                        "Custom analytics and reporting",
                                        "White-labeling options",
                                        "API access",
                                        "24/7 priority support"
                                    ],
                                    limitations: [],
                                    cta: "Contact Sales",
                                    popular: false
                                }
                            ].map((plan, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex"
                                >
                                    <Card className={`flex flex-col w-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                                        <CardHeader>
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                                {plan.popular && (
                                                    <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-baseline mt-2">
                                                <span className="text-3xl font-medium">{plan.price}</span>
                                                {plan.period && (
                                                    <span className="ml-1 text-muted-foreground">{plan.period}</span>
                                                )}
                                            </div>
                                            <CardDescription>{plan.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-medium">What's included:</h4>
                                                <ul className="space-y-2">
                                                    {plan.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                                                            <span className="text-sm">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>

                                                {plan.limitations.length > 0 && (
                                                    <>
                                                        <h4 className="text-sm font-medium mt-4">Limitations:</h4>
                                                        <ul className="space-y-2">
                                                            {plan.limitations.map((limitation, i) => (
                                                                <li key={i} className="flex items-start">
                                                                    <X className="h-4 w-4 text-muted-foreground mr-2 mt-1" />
                                                                    <span className="text-sm text-muted-foreground">{limitation}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                asChild
                                                className="w-full"
                                                variant={plan.popular ? "default" : "outline"}
                                            >
                                                <Link href={plan.name === "Enterprise" ? "/contact" : "/register?type=organization&plan=business"}>
                                                    {plan.cta}
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-medium mb-4">Frequently Asked Questions</h2>
                            <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                                Have questions about our pricing? Find answers to common questions below.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {[
                                {
                                    question: "Can I change plans at any time?",
                                    answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle."
                                },
                                {
                                    question: "Is there a free trial for paid plans?",
                                    answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start your trial."
                                },
                                {
                                    question: "What payment methods do you accept?",
                                    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
                                },
                                {
                                    question: "Do you offer discounts for annual billing?",
                                    answer: "Yes, you can save 20% by choosing annual billing on any of our paid plans."
                                },
                                {
                                    question: "Can I get a refund if I'm not satisfied?",
                                    answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
                                },
                                {
                                    question: "Do you offer special pricing for educational institutions?",
                                    answer: "Yes, we offer special discounts for educational institutions. Please contact our sales team for more information."
                                }
                            ].map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="h-full"
                                >
                                    <Card className="h-full flex flex-col">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{faq.question}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-muted-foreground">{faq.answer}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-24 bg-[#1A2A29] text-primary-foreground">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-medium mb-4">Ready to Get Started?</h2>
                            <p className="text-lg opacity-90 max-w-[800px] mx-auto mb-8">
                                Join thousands of professionals and organizations already using Hiron AI to connect talent with opportunity.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" variant="secondary" className="font-medium">
                                    <Link href="/register?type=candidate">
                                        <User className="mr-2 h-5 w-5" />
                                        Sign Up as Individual
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 hover:text-white">
                                    <Link href="/register?type=organization">
                                        <Building2 className="mr-2 h-5 w-5" />
                                        Register Organization
                                    </Link>
                                </Button>
                            </div>
                            <p className="mt-6 text-primary-foreground/80">
                                Have questions? <Link href="/contact" className="underline">Contact our sales team</Link>
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}