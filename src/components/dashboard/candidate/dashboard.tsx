"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Share2, ArrowRight, CheckCircle2, AlertCircle, Users, Info, Clock, Activity } from "lucide-react";
import { ApplicationContext } from "@/context/applicationContext";
import { iconMap } from "@/lib/icons";
import { activityTypeMap, RecentActivity } from "@/types/dashboard";
import Link from "next/link";
import { BASE_URL } from "@/app/api/constants";

export default function CandidateDashboard() {
    const { setActiveTab, userInfo } = useContext(ApplicationContext) || {};

    // Profile sections
    const profileSections = userInfo?.stats;

    const completedSections = profileSections?.filter((section: any) => section.completed)?.length;
    const completionPercentage = Math.round((completedSections / profileSections?.length) * 100);

    // Organization recent activity
    const recentActivities: RecentActivity[] = Array.isArray(userInfo?.activity) ? userInfo.activity : [];

    // Resume templates
    const templates = userInfo?.templates;

    const handleShare = (name: any, previewUrl: any) => {
        if (navigator.share) {
            navigator.share({
                title: `${userInfo?.user?.name} - Resume`,
                text: `Check out my resume created with ${name} template on Hiron AI`,
                url: `${BASE_URL.url}/templates/preview/${previewUrl}?profile=${userInfo?.user?.userName}`,
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(`${BASE_URL.url}/templates/preview/${previewUrl}?profile=${userInfo?.user?.userName}`);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="space-y-8">
            {/* Profile Completion Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Completion</CardTitle>
                        <CardDescription>Complete your profile to maximize visibility to potential employers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        {completedSections} of {profileSections?.length} sections completed
                                    </span>
                                    <span className="text-sm font-medium">{completionPercentage}%</span>
                                </div>
                                <Progress value={completionPercentage} className="h-2" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {profileSections?.map((section: any, profIndex) => {
                                    const IconComponent = iconMap[section.icon] || Users;

                                    return (
                                        <div
                                            key={profIndex}
                                            onClick={() => setActiveTab(section.key)} // Set active tab instead of navigating
                                            className={`cursor-pointer flex items-center gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-primary/5 ${section.completed
                                                ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
                                                : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20"
                                                }`}
                                        >
                                            <IconComponent className={`h-5 w-5 ${section.completed ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`} />
                                            <div className="flex-1 font-medium">{section.name}</div>
                                            {section.completed ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Resume Templates Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card>
                    <CardHeader className="flex flex-row flex-wrap items-center justify-between">
                        <div>
                            <CardTitle>Your Resume Templates</CardTitle>
                            <CardDescription>Manage and share your resume templates</CardDescription>
                        </div>
                        {
                            templates?.length > 0 &&
                            <Button size="sm" onClick={() => setActiveTab("templates")}>
                                View All Templates
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        }
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {templates?.map((template, tempoIndex) => (
                                <div key={tempoIndex} className="rounded-lg border bg-card p-4">
                                    <div className="aspect-video w-full rounded-md bg-secondary mb-4 flex items-center justify-center">
                                        <FileText className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{template.name}</h3>
                                            <p className="text-xs text-muted-foreground">{template?.premium ? 'Premium Template' : 'Free Template'}</p>
                                        </div>
                                        <div
                                            className={`text-xs px-2 py-1 rounded-full ${template?.status === 'active'
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                }`}
                                        >
                                            {template.status === "active" ? "Active" : "Inactive"}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap lg:flex-nowrap items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleShare(template.name, template.previewUrl)}>
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Share
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Link href={`templates/preview/${template?.previewUrl}?profile=${userInfo?.user?.userName}`} className="flex items-center">
                                                <FileText className="mr-2 h-4 w-4" />
                                                Preview
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {
                            templates?.length === 0 &&
                            <div className="p-4 flex flex-col items-center justify-center text-center">
                                {/* <div className="rounded-lg border border-dashed bg-muted/50 p-4 flex flex-col items-center justify-center text-center"> */}
                                <div className="rounded-full bg-primary/10 p-3 mb-3">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-medium mb-1">Add New Template</h3>
                                <p className="text-xs text-muted-foreground mb-4">You can add up to 5 free templates</p>
                                <Button size="sm" onClick={() => setActiveTab("templates")}>
                                    Browse Templates
                                </Button>
                            </div>
                        }
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Card>
                    <CardHeader className="flex flex-wrap gap-4 flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest actions and updates in your organization</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities?.map((activity, activIndex) => {
                                const { icon: IconComponent, color } = activityTypeMap[activity.type] || { icon: Info, color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };

                                return (
                                    <div key={activIndex} className="flex items-center gap-4 rounded-lg border p-4">
                                        {/* ✅ Dynamic Icon with Color */}
                                        <div className={`rounded-full p-2 min-h-6 min-w-6 ${color}`}>
                                            <IconComponent className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm">{activity.title}</p>
                                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {activity.createdAt}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {
                            recentActivities?.length === 0 && (
                                <div className="p-4 flex flex-col items-center justify-center text-center">
                                    <div className="rounded-full bg-primary/10 p-3 mb-3">
                                        <Activity className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-medium mb-1">No Recent Activity</h3>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        You haven’t performed any activity yet.
                                    </p>
                                </div>
                            )
                        }

                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}