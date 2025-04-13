"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Star,
    Quote
} from "lucide-react";

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Software Engineer",
        avatar: "SJ",
        content: "Hiron AI transformed my job search. I created a professional resume in minutes and received interview requests within days.",
        rating: 5
    },
    {
        name: "Michael Chen",
        role: "HR Director",
        avatar: "MC",
        content: "As a hiring manager, Hiron AI has streamlined our recruitment process. The AI-powered search helps us find qualified candidates quickly.",
        rating: 5
    },
    {
        name: "Emily Rodriguez",
        role: "Marketing Specialist",
        avatar: "ER",
        content: "The resume templates are beautiful and professional. I love how easy it is to update my information across all templates.",
        rating: 4
    },
    {
        name: "David Kim",
        role: "University Recruiter",
        avatar: "DK",
        content: "Our university uses Hiron AI to connect students with employers. The platform's verification system ensures trust on both sides.",
        rating: 5
    }
];

export function Testimonials() {
    return (
        <section className="pt-16 md:py-16">
            <div className="px-4 md:px-6 mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-medium mb-4">
                            What Our Users Say
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                            Hear from professionals and organizations who have transformed their hiring process with Hiron AI.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="h-full"
                        >
                            <Card className="h-full flex flex-col">
                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-12 w-12 bg-gray-100">
                                            <AvatarImage src="" alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <h3 className="font-semibold">{testimonial.name}</h3>
                                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex">
                                        {Array(testimonial.rating).fill(0).map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <div className="mt-4 flex flex-grow">
                                        <Quote className="h-6 w-6 text-muted-foreground/50 mr-2 shrink-0" />
                                        <p className="text-muted-foreground">{testimonial.content}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}