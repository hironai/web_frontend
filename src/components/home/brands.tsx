"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Brands() {
    const brands = [
        { name: "Google", logo: "/assets/images/brands/color/google.svg" },
        { name: "Microsoft", logo: "/assets/images/brands/color/microsoft.svg" },
        { name: "Linear", logo: "/assets/images/brands/color/linear.svg" },
        { name: "Asana", logo: "/assets/images/brands/color/asana.svg" },
        { name: "Meta", logo: "/assets/images/brands/color/meta.svg" },
        { name: "Adobe", logo: "/assets/images/brands/color/adobe.svg" },
        { name: "Paypal", logo: "/assets/images/brands/color/paypals.svg" },
        { name: "Slack", logo: "/assets/images/brands/color/slack.svg" },
        { name: "Gitlab", logo: "/assets/images/brands/color/loom.svg" },
        { name: "Dropbox", logo: "/assets/images/brands/color/airbnb.svg" },
        { name: "Shopify", logo: "/assets/images/brands/color/shopify.svg" },
        { name: "Walmart", logo: "/assets/images/brands/color/walmart.svg" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 gap-y-8 items-center justify-items-center"
        >
            {brands.map((brand, index) => (
                <motion.div
                    key={brand.name}
                    initial={{ opacity: 0, y: 20 }}
                    // animate={{ opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                    }}
                    // whileHover={{ scale: 1.05 }}
                    viewport={{ once: true }}
                    className="w-28 h-12 flex justify-between items-center overflow-hidden relative  transition-all duration-300"
                >
                    <Image
                        src={brand.logo}
                        alt="Mentor"
                        width={120}
                        height={120}
                        className="object-cover"
                        // className="object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-500"
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};