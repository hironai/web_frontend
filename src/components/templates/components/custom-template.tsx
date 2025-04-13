"use client";

import { Button } from "@/components/ui/button";
import { Check, FileText } from "lucide-react";
import Link from "next/link";


export default function GetCustomTemplate() {
    return (
        <div className="bg-secondary/20 rounded-lg p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-2/3">
                    <h2 className="text-2xl font-medium mb-4">Need a Custom Template?</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                        If you can't find the perfect template for your needs, our design team can create a custom template tailored specifically for you.
                    </p>
                    <ul className="space-y-2 mb-6">
                        {[
                            "Personalized design based on your requirements",
                            "Quick turnaround time",
                            "Unlimited revisions until you're satisfied",
                            "Exclusive to your profile"
                        ].map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <Check className="h-5 w-5 text-primary mr-2" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <Button asChild>
                        <Link href="/contact">Contact Us for Custom Design</Link>
                    </Button>
                </div>
                <div className="md:w-1/3">
                    <div className="aspect-square w-full rounded-md bg-primary/10 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
}