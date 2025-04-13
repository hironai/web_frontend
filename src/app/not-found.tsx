"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white backdrop-blur supports-[backdrop-filter]:bg-background/90 flex items-center justify-center p-4">
            <div className="text-center">
                {/* Animated 404 Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <div className="text-[150px] md:text-[200px] font-medium text-appPurple-900 select-none">
                        404
                    </div>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {/* Animated Circles */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full border-4 border-joblink-teal opacity-20"
                                initial={{ width: 20, height: 20 }}
                                animate={{
                                    width: [20, 200 + i * 50],
                                    height: [20, 200 + i * 50],
                                    opacity: [0.2, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeOut",
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl font-medium text-gray-900">Page Not Found</h1>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have wandered off into the digital wilderness.
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button asChild size="lg" className="gap-2">
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Reload Page
                    </Button>
                </motion.div>

                {/* Animated Background Elements */}
                <div className="fixed inset-0 -z-10 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            suppressHydrationWarning
                            key={i}
                            className="absolute bg-joblink-teal/10 rounded-full"
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, Math.random() * 100 - 50],
                                x: [0, Math.random() * 100 - 50],
                                scale: [1, Math.random() + 0.5],
                            }}
                            transition={{
                                duration: Math.random() * 5 + 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}