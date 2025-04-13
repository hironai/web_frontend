"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, Twitter, Linkedin, Instagram, Youtube, MapIcon } from "lucide-react";
import { Logo } from "../logo";

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
        href={href}
        className="text-gray-300 hover:text-white transition-colors duration-200"
    >
        {children}
    </Link>
);

const FooterColumn = ({
    title,
    links,
    delay = 0
}: {
    title: string;
    links: { label: string; href: string }[];
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
    >
        <h3 className="text-white font-medium text-xl mb-6">{title}</h3>
        <ul className="space-y-3">
            {links.map((link, index) => (
                <li key={index}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
            ))}
        </ul>
    </motion.div>
);

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-custom-footer text-white">
            <div className="container mx-auto px-4 pt-16 pb-8 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Logo and Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="col-span-1"
                    >
                        <div className="flex items-center gap-8 mb-6 -mt-2">
                            <Logo className="text-white" />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Mail size={18} className="text-gray-400" />
                                <FooterLink href="mailto:hello@clause.com">contact@hironai.com</FooterLink>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={18} className="text-gray-400" />
                                <FooterLink href="tel:+447584470579">(+44) 7584 470579</FooterLink>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapIcon size={18} className="text-gray-400 min-h-5 min-w-5" />
                                <FooterLink href="">Buckingham Palace Road, London SW1W 9SR, UK</FooterLink>
                            </div>
                        </div>
                    </motion.div>

                    {/* Solution */}
                    <FooterColumn
                        title="For Candidates"
                        delay={0.1}
                        links={[
                            { label: "Create Profile", href: "/register?type=candidate" },
                            { label: "Resume Templates", href: "/templates" },
                            { label: "Premium Templates", href: "/pricing" },
                            { label: "FAQ", href: "/faq" },
                        ]}
                    />

                    {/* Customers */}
                    <FooterColumn
                        title="For Organizations"
                        delay={0.2}
                        links={[
                            { label: "Register Organization", href: "/register?type=organization" },
                            { label: "Search Candidates", href: "/search" },
                            { label: "Invite Employees", href: "/invite" },
                            { label: "Pricing Plans", href: "/pricing" },
                        ]}
                    />

                    {/* Resources */}
                    <FooterColumn
                        title="Company"
                        delay={0.3}
                        links={[
                            { label: "About Us", href: "/about" },
                            { label: "Contact", href: "/contact" },
                            { label: "Privacy Policy *", href: "/privacy" },
                            { label: "Terms of Service", href: "/terms" },
                        ]}
                    />
                </div>

                {/* Bottom Section */}
                <div className="mt-10 pt-8 border-t border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <p className="text-gray-400 text-base">© Copyright {currentYear} Hiron AI. All rights reserved.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex gap-6 mt-6 md:mt-0"
                    >
                        <FooterLink href="#">
                            <Twitter size={20} />
                        </FooterLink>
                        <FooterLink href="#">
                            <Linkedin size={20} />
                        </FooterLink>
                        <FooterLink href="#">
                            <Instagram size={20} />
                        </FooterLink>
                        <FooterLink href="#">
                            <Youtube size={20} />
                        </FooterLink>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}