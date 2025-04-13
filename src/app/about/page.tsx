"use client";

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Clock, 
  Users, 
  Building2, 
  GraduationCap, 
  ArrowRight,
  Globe,
  Target,
  Sparkles,
  Heart,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import CTA from '@/components/CTA';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-12 bg-gradient-to-b from-primary/10 to-white">
          <div className="absolute inset-0 pointer-events-none" />
          <div className="container px-4 md:px-6 mx-auto max-w-7xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl font-medium tracking-tighter mb-6">
                Revolutionizing <br/> How the World Connects with Talent
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We're building the future of professional networking and talent discovery, making it easier than ever to showcase your skills and find the perfect opportunity.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/register">Join Our Community</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { number: "1M+", label: "Active Users", icon: Users },
                { number: "50K+", label: "Organizations", icon: Building2 },
                { number: "100+", label: "Countries", icon: Globe },
                { number: "95%", label: "Success Rate", icon: Target }
              ].map((stat, index) => (
                <Card key={index} className='p-6 hover:bg-primary/5 transition-colors'>
                  <div className='flex flex-wrap gap-4 items-center justify-start'>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                   <stat.icon className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                 <p className="text-3xl font-medium">{stat.number}</p>
                 <p className="text-sm text-muted-foreground">{stat.label}</p>
                 </div>
                </div>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl font-medium tracking-tighter mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  To create a more efficient, transparent, and accessible job market by connecting the right talent with the right opportunities through innovative technology.
                </p>
                <div className="space-y-4">
                  {[
                    "Empowering professionals to showcase their true potential",
                    "Making talent discovery seamless and efficient",
                    "Building meaningful connections in the professional world",
                    "Creating equal opportunities for everyone"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/30 rounded-3xl transform rotate-3"></div>
                <Card className="relative transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Innovation</h3>
                          <p className="text-sm text-muted-foreground">Cutting-edge technology</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Heart className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Passion</h3>
                          <p className="text-sm text-muted-foreground">Dedicated to your success</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Results</h3>
                          <p className="text-sm text-muted-foreground">Proven track record</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>
        

        {/* Team Section */}
        <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="text-center max-w-3xl mx-auto mb-16"
                        >
                            <h2 className="text-3xl font-medium mb-6">Our Team</h2>
                            <p className="text-lg text-muted-foreground">
                                Meet the passionate individuals behind Hiron AI who are dedicated to transforming how talent and opportunity connect.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    name: "Sarah Johnson",
                                    role: "CEO & Co-Founder",
                                    bio: "Former HR Director with 15+ years of experience in talent acquisition and management.",
                                    image: "/assets/images/team/new/woman_two.svg"
                                },
                                {
                                    name: "Michael Chen",
                                    role: "CTO & Co-Founder",
                                    bio: "Tech entrepreneur with multiple successful startups in the HR tech space.",
                                    image: "/assets/images/team/new/man_one.svg"
                                },
                                {
                                    name: "Emily Rodriguez",
                                    role: "Chief Product Officer",
                                    bio: "Product leader with a passion for creating intuitive user experiences.",
                                    image: "/assets/images/team/new/woman.svg"
                                    // image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&q=80"
                                },
                                {
                                    name: "David Kim",
                                    role: "Head of AI & Data",
                                    bio: "AI researcher specializing in matching algorithms and natural language processing.",
                                    image: "/assets/images/team/new/man_two.svg"
                                }
                            ].map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                                    <p className="text-primary mb-2">{member.role}</p>
                                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <CTA />
      </main>

      <Footer />
    </div>
  );
}