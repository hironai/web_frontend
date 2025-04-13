"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';


// Validation schema
const contactSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
    message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof contactSchema>>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: ""
        }
    });

    const onSubmit = (data: z.infer<typeof contactSchema>) => {
        setIsSubmitting(true);
        console.log("Contact form submitted:", data);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            form.reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <section className='py-12 bg-gradient-to-b from-primary/10 to-white'>
                    <div className='container px-4 md:px-6 mx-auto max-w-7xl'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl font-medium tracking-tight mb-4">Contact Us</h1>
                        <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
                            Have questions or feedback? We'd love to hear from you. Get in touch with our team.
                        </p>
                    </motion.div>
                    </div>
                </section>
                <div className="container px-4 md:px-6 mx-auto max-w-7xl">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Send Us a Message</CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </CardDescription>
                                </CardHeader>
                                {isSubmitted ? (
                                    <CardContent className="pt-6">
                                        <div className="flex flex-col items-center justify-center text-center p-6">
                                            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h3 className="text-2xl font-medium mb-2">Message Sent!</h3>
                                            <p className="text-muted-foreground mb-6">
                                                Thank you for reaching out. We'll respond to your inquiry as soon as possible.
                                            </p>
                                            <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                                        </div>
                                    </CardContent>
                                ) : (
                                    <form onSubmit={form.handleSubmit(onSubmit)}>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Your Name</Label>
                                                <Input
                                                    id="name"
                                                    placeholder="John Doe"
                                                    {...form.register("name")}
                                                />
                                                {form.formState.errors.name && (
                                                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    {...form.register("email")}
                                                />
                                                {form.formState.errors.email && (
                                                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input
                                                    id="subject"
                                                    placeholder="How can we help you?"
                                                    {...form.register("subject")}
                                                />
                                                {form.formState.errors.subject && (
                                                    <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message</Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Please provide details about your inquiry..."
                                                    rows={6}
                                                    {...form.register("message")}
                                                />
                                                {form.formState.errors.message && (
                                                    <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </form>
                                )}
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                    <CardDescription>
                                        Here are the different ways you can reach us.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Email</h3>
                                            <p className="text-muted-foreground">contact@hironai.com</p>
                                            {/* <p className="text-muted-foreground">support@hironai.com</p> */}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Phone</h3>
                                            <p className="text-muted-foreground">(+44) 7584 470579</p>
                                            <p className="text-muted-foreground">Monday - Friday, 9am - 5pm EST</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Office</h3>
                                            <p className="text-muted-foreground">Buckingham Palace Road,</p>
                                            <p className="text-muted-foreground">London SW1W 9SR, United Kingdom</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="p-6">
                                <p className="text-sm text-gray-500 -mt-2 mb-2">Advertisement</p>
                                <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-4 text-gray-700">
                                    <h4 className="font-semibold mb-2">$199.00/year</h4>
                                    <p className="text-sm mb-4">Exclusive offer on complete one year plan. Get at 30% less right now. Offer valid only till midnight.</p>
                                    <button className="bg-primary/70 hover:bg-primary/80 hover:transition-colors text-white px-4 py-2 rounded-full text-sm font-medium">
                                        Register Now
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    <Card className='my-20'>
                                <CardHeader>
                                    <CardTitle>Frequently Asked Questions</CardTitle>
                                    <CardDescription>
                                        Quick answers to common questions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="font-medium mb-1">How do I create a profile?</h3>
                                        <p className="text-base text-muted-foreground">
                                            Simply register as a candidate and follow the guided process to complete your profile sections.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-1">Is my data secure?</h3>
                                        <p className="text-base text-muted-foreground">
                                            Yes, we use industry-standard encryption and security practices to protect your personal information.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-1">How do organizations search for candidates?</h3>
                                        <p className="text-base text-muted-foreground">
                                            Organizations can use our powerful search tools or AI-powered assistant to find candidates matching their specific requirements.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-1">Are there any fees for basic services?</h3>
                                        <p className="text-base text-muted-foreground">
                                            Basic profiles and templates are free. Premium templates and advanced features are available for a small fee.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}