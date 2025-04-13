"use client";

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "What is Hiron AI?",
        answer: "Hiron AI is a global resume database that connects professionals with organizations. It allows job seekers to create and share professional resumes while enabling organizations to search for qualified candidates."
    },
    {
        question: "How do I create a resume?",
        answer: "After registering as a candidate, you can create your resume by filling in your personal details, professional experience, education, skills, and other relevant information. You can then choose from various templates to display your resume."
    },
    {
        question: "Can I update my resume after creating it?",
        answer: "Yes, you can update your information at any time. Changes will automatically reflect across all your resume templates."
    },
    {
        question: "How many templates can I use?",
        answer: "Free users can use 1 template, while Professional subscribers can use up to 5 templates."
    },
    {
        question: "How do organizations verify their identity?",
        answer: "Organizations go through a verification process that includes providing official documentation, business registration details, and contact information. Our team reviews these documents to verify the organization's legitimacy."
    },
    {
        question: "How can organizations upload employee data?",
        answer: "Organizations can upload employee data individually or in bulk using our Excel template. The system checks for duplicates and validates the data format before importing."
    },
    {
        question: "Is my data secure?",
        answer: "Yes, we implement industry-standard security measures to protect your data. You also have control over your privacy settings to determine who can view your information."
    },
    {
        question: "How does the AI-powered search work?",
        answer: "Our AI-powered search allows organizations to describe their requirements in natural language. The system then translates this into an optimized database query to find the most relevant candidates."
    }
];

export function FAQ() {
    return (
        <section className="py-16 md:py-24">
            <div className="px-4 md:px-6 mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-medium mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                            Find answers to common questions about Hiron AI.
                        </p>
                    </div>
                </div>
                <motion.div
                    className="mx-auto max-w-3xl mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-base text-start">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}