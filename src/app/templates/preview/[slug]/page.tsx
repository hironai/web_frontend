"use client";

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Printer } from 'lucide-react';
import ModernProfessional from '@/components/templates/modern-professional';
import CreativePortfolio from '@/components/templates/creative-portfolio';
import Minimalist from '@/components/templates/minimalist';
import TechnicalResume from '@/components/templates/technical-resume';
import AcademicCV from '@/components/templates/academic-cv';
import SimpleClean from '@/components/templates/simple-clean';
import CreativeDesigner from '@/components/templates/creative-designer';
import ExecutiveSummary from '@/components/templates/executive-summary';
import { UserData } from '@/types/templates';
import { getTemplate_API } from '@/app/api/controller/templateController';
import GetCustomTemplate from '@/components/templates/components/custom-template';
import { IncompleteProfileDialogTemplate } from '@/components/dashboard/dialog/incomplete-profile-dialog-template';


export default function TemplatePreview() {
    const { slug } = useParams<any>();
    const searchParams = useSearchParams();
    const [userData, setUserData] = useState<UserData>();
    const [loading, setLoading] = useState(true);
    const [template, setTemplate] = useState<any>();

    useEffect(() => {
        const getTemplate = async () => {
            try {
                const username = searchParams.get("profile") || "";
                const response = await getTemplate_API(slug, username);
                setUserData(response.data.dashboard ?? {});
                setTemplate(response.data.template ?? {});
            } catch (error) {
                console.error("Failed to fetch template:", error);
            } finally {
                setLoading(false);
            }
        };

        getTemplate();
    }, [slug, searchParams]);



    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        window.print();
        setTimeout(() => setIsPrinting(false), 500);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${userData?.personal.name} - Resume`,
                text: `Check out my resume created with ${template?.name} template on Hiron AI`,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };
    

    if (loading || !userData) return <div className="p-8 text-lg h-full w-full flex items-center justify-center">Loading template...</div>;

    if(searchParams.get("profile") && !userData?.isPorfileCompleted) return <IncompleteProfileDialogTemplate profile={userData?.isPorfileCompleted} />

    return (
        <div className="min-h-screen bg-background">
            {/* <Navbar /> */}

            <main className="py-8">
                <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row justify-between items-center mb-8 print:hidden"
                    >
                        <div>
                            <h1 className="text-3xl font-medium tracking-tight mb-2">{template?.name}</h1>
                            <p className="text-muted-foreground">{template?.description}</p>
                        </div>

                        {
                            Object.keys(template).length > 0 && (
                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                    <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print
                                    </Button>
                                    <Button variant="outline" onClick={handleShare}>
                                        <Share2 className="mr-2 h-4 w-4" />
                                        Share
                                    </Button>
                                    {/* <Button>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download PDF
                                    </Button> */}
                                </div>
                            )
                        }
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="print:shadow-none">
                            {
                                Object.keys(template).length > 0 && (
                                    <CardContent className="p-0">
                                        {/* Modern Professional Template */}
                                        {slug === 'modern-professional' && (
                                            <ModernProfessional userData={userData} />
                                        )}

                                        {/* Creative Portfolio Template */}
                                        {slug === 'creative-portfolio' && (
                                            <CreativePortfolio userData={userData} />
                                        )}

                                        {/* Minimalist Template */}
                                        {slug === 'minimalist' && (
                                            <Minimalist userData={userData} />
                                        )}

                                        {/* Technical Resume Template */}
                                        {slug === 'technical-resume' && (
                                            <TechnicalResume userData={userData} />
                                        )}

                                        {/* Academic CV Template */}
                                        {slug === 'academic-cv' && (
                                            <AcademicCV userData={userData} />
                                        )}

                                        {/* Simple Clean Template */}
                                        {slug === 'simple-clean' && (
                                            <SimpleClean userData={userData} />
                                        )}

                                        {/* Creative Designer Template */}
                                        {slug === 'creative-designer' && (
                                            <CreativeDesigner userData={userData} />
                                        )}

                                        {slug === 'executive-summary' && (
                                            <ExecutiveSummary userData={userData} />
                                        )}
                                    </CardContent>
                                )
                            }

                            {
                                Object.keys(template).length === 0 && (
                                   <GetCustomTemplate />
                                )
                            }
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}