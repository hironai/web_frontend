"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    X, LogOut, Building2, Users, Upload, Search, MessageSquare, User, Briefcase, FileText, Award, BookOpen,
    Link as LinkIcon, MapPin, Trophy, Share2, Settings, ScanFace, Brain, BookOpenText, Microscope, Languages,
    BadgeCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";

// Import Organization Components
import OrganizationDashboard from "@/components/dashboard/organization/dashboard";
import SearchCandidates from "@/components/dashboard/organization/searchCandidates";
import AISearch from "@/components/dashboard/organization/aiSearch";
import EmployeeDatabase from "@/components/dashboard/organization/employeeDatabase";
import UploadEmployees from "@/components/dashboard/organization/uploadEmployees";
import Invitations from "@/components/dashboard/organization/invitations";
import OrgSettings from "@/components/dashboard/organization/settings";

// Import Candidate Components
import CandidateDashboard from "@/components/dashboard/candidate/dashboard";
import PersonalDetails from "@/components/dashboard/candidate/personalDetails";
import ProfessionalDetails from "@/components/dashboard/candidate/professionalDetails";
import Experience from "@/components/dashboard/candidate/experience";
import Certifications from "@/components/dashboard/candidate/certifications";
import Projects from "@/components/dashboard/candidate/projects";
import Links from "@/components/dashboard/candidate/links";
import Address from "@/components/dashboard/candidate/address";
import Achievements from "@/components/dashboard/candidate/achievements";
import Templates from "@/components/dashboard/candidate/templates";
import CandidateSettings from "@/components/dashboard/candidate/settings";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDashboard_API } from "../api/controller/dashboardController";
import { HttpStatusCode } from "axios";
import {toast} from "sonner";
import { useRouter } from "next/navigation";
import { logoutUser_API } from "../api/controller/userController";
import { ApplicationContext } from "@/context/applicationContext";
import { NavigationItem } from "@/types/dashboard";
import Loader from "@/components/layout/loader";
import SkillsPage from "@/components/dashboard/candidate/skills";
import LanguagesPage from "@/components/dashboard/candidate/languages";
import PublicationsPage from "@/components/dashboard/candidate/publications";
import ResearchPage from "@/components/dashboard/candidate/research";
import Education from "@/components/dashboard/candidate/education";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShortlistedEmployees from "@/components/dashboard/organization/shortlistedEmployees";
import { DashboardLayoutSimmer } from "@/components/simmer/dashboard";
import { LoadingCard } from "@/components/simmer/dashboard/loading-card";


const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  


export default function Dashboard() {
    const { setUserInfo, isOrganization, activeTab, setActiveTab, setIsOrganization, userInfo, reloadDashboardData, setReloadDashboardData } = useContext(ApplicationContext) || {};
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const route = useRouter();
    const currentDate = new Date().toDateString();


    // ✅ Check if `userInfo` is empty
    const isUserInfoEmpty = !userInfo || Object.keys(userInfo).length === 0;

    useEffect(() => {
        // if (!isUserInfoEmpty) return;  // ✅ Prevent running if userInfo is already available
        // if(reloadDashboardData) {
        //     fetchData();
        // }

        fetchData();
        setTimeout(() => {
            setReloadDashboardData(false)
        }, 400)
    }, [isUserInfoEmpty, reloadDashboardData]);  // ✅ Runs only when `userInfo` is empty


    const fetchData = async () => {
        try {
            let response = await getDashboard_API();

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                // toast.info(responseData.message);

                // ✅ Set user info in the context
                setUserInfo(responseData.dashboard);                    

                // ✅ Update `isOrganization` based on user role
                setIsOrganization(responseData.dashboard.user.role === "Organization" );

            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
            if (status === HttpStatusCode.Forbidden) {
                route.push("/login");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Define type for Navigation Object
    type Navigation = Record<string, NavigationItem>;

    const organizationNavigation: Navigation = {
        dashboard: { name: "Dashboard", icon: Building2, component: <OrganizationDashboard /> },
        search: { name: "Search Candidates", icon: Search, component: <SearchCandidates /> },
        aiSearch: { name: "AI Search", icon: MessageSquare, component: <AISearch /> },
        employees: { name: "Employee Database", icon: Users, component: <EmployeeDatabase /> },
        upload: { name: "Upload Employees", icon: Upload, component: <UploadEmployees /> },
        shortlisted: { name: "Shortlisted Candidates", icon: BadgeCheck, component: <ShortlistedEmployees /> },
        // invitations: { name: "Invitations", icon: Mail, component: <Invitations /> },
        settings: { name: "Settings", icon: Settings, component: <OrgSettings /> }
    };

    const candidateNavigation: Navigation = {
        dashboard: { name: "Dashboard", icon: User, component: <CandidateDashboard /> },
        personal: { name: "Personal Details", icon: User, component: <PersonalDetails /> },
        professional: { name: "Professional Details", icon: Briefcase, component: <ProfessionalDetails /> },
        experience: { name: "Experience", icon: FileText, component: <Experience /> },
        education: { name: "Education", icon: BookOpen, component: <Education /> },
        certifications: { name: "Certifications", icon: Award, component: <Certifications /> },
        projects: { name: "Projects", icon: FileText, component: <Projects /> },
        links: { name: "Links", icon: LinkIcon, component: <Links /> },
        address: { name: "Address", icon: MapPin, component: <Address /> },
        achievements: { name: "Achievements", icon: Trophy, component: <Achievements /> },
        skills: { name: "Skills", icon: Brain, component: <SkillsPage /> },
        research: { name: "Research", icon: Microscope, component: <ResearchPage /> },
        languages: { name: "Languages", icon: Languages, component: <LanguagesPage /> },
        publications: { name: "Publications", icon: BookOpenText, component: <PublicationsPage /> },
        templates: { name: "Templates", icon: Share2, component: <Templates /> },
        settings: { name: "Settings", icon: Settings, component: <CandidateSettings /> }
    };

    // Ensure activeTab is a valid key
    const navigation: Navigation = isOrganization ? organizationNavigation : candidateNavigation;
    const activeComponent = navigation[activeTab as keyof Navigation]?.component || <OrganizationDashboard />;

    function handleSidebarClick(key: string) {
        setActiveTab(key);
        console.log(key, 'checkKey')
        setIsSidebarOpen(false)

        // Scroll to top of content when a tab is clicked
        if (contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    async function handleLogout() {
        try {
            let response = await logoutUser_API();

            // ✅ Ensure status is always a number by using fallback (e.g., 500)
            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                route.push("login");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }
      

    return (
            !userInfo || !userInfo.user?.email ? (
            <DashboardLayoutSimmer>
                <div className="space-y-16 p-8">
        {[1, 2].map((section) => (
          <motion.section
            key={section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: section * 0.2 }}
            className="space-y-4"
          >
            <div className="h-6 w-48 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-2 w-20 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-2 w-20 bg-gray-200 rounded-md animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((card) => (
                <LoadingCard key={card} delay={card * 0.1} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
      </DashboardLayoutSimmer>
        ) :
        (
            <div className="min-h-screen bg-background">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-30 flex justify-between h-16 items-center gap-4 border-b bg-background px-4">
                <Logo />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    aria-label="Toggle menu"
                    className="text-primary"
                >
                    <ScanFace size={31} />
                </Button>
            </header>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {
                isLoading || isUserInfoEmpty ? (<Loader />) :
                    (<div className="">
                        {/* Sidebar */}
                        <AnimatePresence>
                            <motion.aside
                                className={`fixed left-0 lg:h-full md:h-full min-h-full h-[calc(100vh-3.5rem)] top-0 w-[280px] bg-white border-r border-gray-200 z-40 flex-col ${isSidebarOpen ? "flex" : "lg:flex hidden"}`}
                                // className="fixed lg:sticky top-0 bottom-0 left-0 z-50 w-72 border-r bg-card lg:h-screen"
                                initial={{ x: -320 }}
                                animate={{ x: 0 }}
                                exit={{ x: -320 }}
                                transition={{ ease: "easeOut", duration: 0.3 }}
                            >
                                <div className="flex h-16 items-center gap-2 border-b py-6 px-4">
                                    <Logo />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-auto lg:hidden"
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>

                                {/* Sidebar Navigation */}
                                <ScrollArea className="flex flex-col gap-2 p-4 flex-1">
                                    {Object.entries(navigation).map(([key, item]) => (
                                        <div
                                            key={key}
                                            className={`flex items-center gap-3 rounded-lg mb-1 px-3 py-2 text-sm transition-colors cursor-pointer ${activeTab === key
                                                ? "bg-primary text-primary-foreground"
                                                : "hover:bg-secondary"
                                                }`}
                                            onClick={() => handleSidebarClick(key)}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </div>
                                    ))}

                                </ScrollArea>

                                
                                <Link href={!isOrganization ? `/view/${userInfo.user?.userName}` : ""} className="px-4 py-2 border-t">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 bg-primary/5"> 
                                            <AvatarImage src="/assets/avatars/men/char1.svg" alt="@shadcn" />
                                            <AvatarFallback> { isUserInfoEmpty ? "" : getInitials(userInfo.user?.name as string)} </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{userInfo.user?.name}</p>
                                            <p className="text-sm text-gray-500">{currentDate}</p>
                                        </div>
                                    </div>
                                </Link>
                                <div className="mt-auto px-4 py-2 border-t" onClick={() => handleLogout()}>
                                    <Link href="" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </Link>
                                </div>
                            </motion.aside>
                        </AnimatePresence>

                        {/* Main Content */}
                        <main className="lg:pl-[280px] max-w-auto bg-gradient-to-b from-primary/5 to-white min-h-screen" ref={contentRef}>
                            <div className="px-4 py-3">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {activeComponent}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </main>
                    </div>)
            }
        </div>
        )
    );
}