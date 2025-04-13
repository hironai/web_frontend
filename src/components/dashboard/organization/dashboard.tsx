"use client";

import { useContext } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUpRight, Clock, Info, Image } from "lucide-react";
import { ApplicationContext } from "@/context/applicationContext";
import { iconMap } from "@/lib/icons";
import { activityTypeMap, QuickAction, RecentActivity, Stat } from "@/types/dashboard";

export default function OrganizationDashboard() {
    const { setActiveTab, userInfo } = useContext(ApplicationContext) || {};    

    // Organization stats
    const stats: Stat[] = Array.isArray(userInfo?.stats) ? userInfo.stats : [];

    // Organization recent activity
    const recentActivities: RecentActivity[] = Array.isArray(userInfo?.activity) ? userInfo.activity : [];

    // Organization quick actions
    const quickActions: QuickAction[] = Array.isArray(userInfo?.quickactions) ? userInfo.quickactions : [];

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-medium tracking-tight text-primary">{userInfo.user?.name} Dashboard</h1>
                <p className="text-muted-foreground">Manage your organization and find the perfect candidates</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {stats.map((stat: Stat) => {
                    const IconComponent = iconMap[stat.icon] || Users; // ✅ Get icon component or default to `User`

                    return (
                        <Card key={stat.name}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between space-x-4">
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-sm font-medium text-primary">{stat.name}</span>
                                        <span className="text-2xl font-bold">{stat.value}</span>
                                        <span className="text-xs text-muted-foreground">{stat.change}</span>
                                    </div>
                                    <div className="rounded-full bg-primary/10 p-3">
                                        <IconComponent className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and actions for your organization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {quickActions.map((action) => {
                                const IconComponent = iconMap[action.icon] || Image;
                                return (
                                    <div
                                        key={action.title}
                                        onClick={() => setActiveTab(action.key)}
                                        className="cursor-pointer flex h-full flex-col rounded-lg border p-4 transition-colors hover:bg-primary/5"
                                    >
                                        <div className={`rounded-full ${action.color} w-fit p-2 mb-3`}>
                                            <IconComponent className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{action.title}</h3>
                                            <p className="text-sm text-muted-foreground">{action.description}</p>
                                        </div>
                                        <div className="mt-3 flex items-center text-sm text-primary">
                                            <span>Get started</span>
                                            <ArrowUpRight className="ml-1 h-4 w-4" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
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
                        {/* <Button variant="outline" size="sm" onClick={() => setActiveTab("activity")}>
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button> */}
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => {
                                const { icon: IconComponent, color } = activityTypeMap[activity.type] || { icon: Info, color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };

                                return (
                                    <div key={activity._id} className="flex items-center gap-4 rounded-lg border p-4">
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
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
