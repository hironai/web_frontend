"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Globe, MapPin, Linkedin, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessCardProps {
    className?: string;
    variant?: "light" | "dark";
    data: {
        name: string;
        title: string;
        company: string;
        email: string;
        phone: string;
        website: string;
        location: string;
        avatar: string;
        social: {
            linkedin?: string;
            twitter?: string;
        };
    };
}

export function BusinessCard({
    className,
    variant = "light",
    data,
}: BusinessCardProps) {
    const isDark = variant === "dark";

    return (
        <motion.div
            // initial={{ opacity: 0, y: 20 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.5 }}
            className={cn(
                "group relative w-full max-w-md overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl ",
                isDark ? "bg-black" : "bg-gray-50",
                className
            )}
        >
            {/* Gradient Background */}
            {
                variant === "dark" ?
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    :
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-300/50 via-transparent to-purple-300/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            }
            
            {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" /> */}

            {/* Card Content */}
            <div className="relative p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                    >
                        <div className="h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-xl">
                            <img
                                src={data.avatar}
                                alt={data.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 rounded-xl ring-1 ring-black/5" />
                    </motion.div>

                    {/* Main Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <h3 className={cn(
                            "text-2xl font-medium tracking-tight",
                            isDark ? "text-white" : "text-gray-900"
                        )}>
                            {data.name}
                        </h3>
                        <p className={cn(
                            "mt-1 text-lg",
                            isDark ? "text-gray-300" : "text-gray-700"
                        )}>
                            {data.title}
                        </p>
                        <p className={cn(
                            "text-sm font-medium",
                            isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                            {data.company}
                        </p>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ContactItem
                        icon={Mail}
                        text={data.email}
                        href={`mailto:${data.email}`}
                        isDark={isDark}
                    />
                    <ContactItem
                        icon={Phone}
                        text={data.phone}
                        href={`tel:${data.phone}`}
                        isDark={isDark}
                    />
                    <ContactItem
                        icon={Globe}
                        text={data.website}
                        href={`https://${data.website}`}
                        isDark={isDark}
                    />
                    <ContactItem
                        icon={MapPin}
                        text={data.location}
                        isDark={isDark}
                    />
                </div>

                {/* Social Links */}
                <div className="mt-6 flex justify-center sm:justify-start gap-4">
                    {data.social.linkedin && (
                        <SocialLink
                            href={data.social.linkedin}
                            icon={Linkedin}
                            isDark={isDark}
                        />
                    )}
                    {data.social.twitter && (
                        <SocialLink
                            href={data.social.twitter}
                            icon={Twitter}
                            isDark={isDark}
                        />
                    )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 h-16 w-16 opacity-10">
                    <div className="absolute inset-0 rotate-45 transform border-t-2 border-r-2 border-gray-900" />
                </div>
                <div className="absolute bottom-0 left-0 h-16 w-16 opacity-10">
                    <div className="absolute inset-0 -rotate-135 transform border-b-2 border-l-2 border-gray-900" />
                </div>
            </div>
        </motion.div>
    );
}

interface ContactItemProps {
    icon: React.ElementType;
    text: string;
    href?: string;
    isDark?: boolean;
}

function ContactItem({ icon: Icon, text, href, isDark }: ContactItemProps) {
    const content = (
        <div className={cn(
            "flex items-center gap-2 rounded-lg p-2 transition-colors",
            isDark
                ? "hover:bg-[#111]"
                : "group hover:bg-white",
                // : "hover:bg-white",
        )}>
            <Icon className={cn(
                "h-4 w-4",
                isDark ? "text-gray-300" : "text-gray-600"
            )} />
            <span className={cn(
                "text-sm truncate",
                isDark ? "text-gray-300" : "text-gray-800 group-hover:text-black"
            )}>
                {text}
            </span>
        </div>
    );

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                {content}
            </a>
        );
    }

    return content;
}

interface SocialLinkProps {
    href: string;
    icon: React.ElementType;
    isDark?: boolean;
}

function SocialLink({ href, icon: Icon, isDark }: SocialLinkProps) {
    return (
        <motion.a
            whileHover={{ scale: 1.1 }}
            // whileTap={{ scale: 0.95 }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors z-50",
                isDark
                    ? "bg-[#111] hover:bg-black"
                    : "bg-gray-200/70 hover:bg-gray-200"
            )}
        >
            <Icon className={cn(
                "h-5 w-5",
                isDark ? "text-gray-300" : "text-gray-600"
            )} />
        </motion.a>
    );
}