"use client";
import { CTASection } from "@/components/home/cta-section";
import { FAQ } from "@/components/home/faq";
import Features from "@/components/home/features";
import { HeroSection } from "@/components/home/hero-section";
import { Testimonials } from "@/components/home/testimonials";
import WhyUs from "@/components/home/why-us";
import { Footer } from "@/components/layout/footer";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
        .then((reg) => console.log("✅ Service Worker registered!", reg))
        .catch((error) => console.log("❌ Service Worker registration failed:", error));
    }
  }, []);



  return (
    <main className="">

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* WHY US */}
      <WhyUs />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* CTA Section */}
      <CTASection />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}