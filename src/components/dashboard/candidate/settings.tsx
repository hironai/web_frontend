"use client";

import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, CreditCard, LogOut, Save, AlertTriangle, Eye, EyeOff, ArrowBigRight, RefreshCw, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {toast} from "sonner";
import { HttpStatusCode } from 'axios';
import { ApplicationContext } from '@/context/applicationContext';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { deleteAccount_API, resetPassword_API } from '@/app/api/controller/userController';
import { useRouter } from 'next/navigation';
import { getLastActiveStatus } from '@/lib/utils';
import { accountSchema, passwordSchema } from '@/lib/validations/candidate';


export default function CandidateSettings() {
    const route = useRouter()
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isOpen, setIsOpen] = useState<any>(false);
    const { userInfo, setUserInfo } = useContext(ApplicationContext)

    // Account form
    const accountForm = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            username: "johndoe",
            email: "john.doe@example.com",
            name: "John Doe",
        }
    });

    // Password form
    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    });

    const onAccountSubmit = (data: z.infer<typeof accountSchema>) => {
        setIsSaving(true);
        console.log("Account form submitted:", data);
        let body = { name: data?.name }
        updateTemplateData(body)
        // Simulate saving delay
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);

            // Reset saved indicator after 3 seconds
            setTimeout(() => {
                setIsSaved(false);
            }, 3000);
        }, 1500);
    };

    useEffect(() => {
        handleAccountDetails()
    }, [userInfo])

    const handleAccountDetails = () => {
        accountForm?.reset({ ...userInfo?.user, username: userInfo?.user?.userName })
    }

    const onPasswordSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            let response = await resetPassword_API({ ...data });
            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                route.replace('login')
            }
        }
        catch (error) {
            console.log(error)
        }
        // Simulate saving delay
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            passwordForm.reset();

            // Reset saved indicator after 3 seconds
            setTimeout(() => {
                setIsSaved(false);
            }, 3000);
        }, 1500);
    };


    const handleDeleteAccount = () => {
        setIsOpen(true)

    };

    const onDelete = async () => {
        try {
            let response = await deleteAccount_API()
            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                setIsOpen(null)
                route.replace('login')
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleNotification = (data: any) => {
        let index = userInfo?.notificationSettings?.findIndex((fi) => fi?._id === data?._id)
        userInfo.notificationSettings[index].value = !data?.value
        setUserInfo({ ...userInfo,  })

    }
    const savePreferences = () => {
        let body = { notificationSettings: userInfo?.notificationSettings }
        updateTemplateData(body)
    }
    const updateTemplateData = async (body: any,) => {
        try {
            let response = await updateCandidate_API(body);

            // ✅ Ensure status is always a number by using fallback (e.g., 500)
            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                setUserInfo({ ...userInfo, ...response.data.dashboard, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })

            }
            //   setIsOpen(null)



        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Tabs defaultValue="account">
                    <TabsList className="grid w-full md:grid-cols-3 grid-cols-2">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        {/* <TabsTrigger value="billing">Billing</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="account" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>
                                    Update your account information and public profile
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={accountForm.handleSubmit(onAccountSubmit)}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                placeholder='e.g., John Doe'
                                                className="pl-9"
                                                {...accountForm.register("name")}
                                            />
                                        </div>
                                        {accountForm.formState.errors.name && (
                                            <p className="text-sm text-destructive">{accountForm.formState.errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                disabled
                                                id="username"
                                                placeholder='e.g., johndoe'
                                                className="pl-9"
                                                {...accountForm.register("username")}
                                            />
                                        </div>
                                        {accountForm.formState.errors.username && (
                                            <p className="text-sm text-destructive">{accountForm.formState.errors.username.message}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Your profile will be available at hironai.com/{accountForm.watch("username")}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                disabled
                                                id="email"
                                                placeholder='e.g., john@hironai.com'
                                                type="email"
                                                className="pl-9"
                                                {...accountForm.register("email")}
                                            />
                                        </div>
                                        {accountForm.formState.errors.email && (
                                            <p className="text-sm text-destructive">{accountForm.formState.errors.email.message}</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-wrap gap-4 justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        {/* Last updated: {userInfo.updatedAt ? getLastActiveStatus(userInfo.updatedAt) : "N/A"} */}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        {/* {isSaved && (
                                            <div className="flex items-center text-green-600 dark:text-green-400">
                                                <CheckCircle2 className="mr-1 h-4 w-4" />
                                                <span>Saved successfully</span>
                                            </div>
                                        )} */}
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Update your account password
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="currentPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder='***********'
                                                className="pl-9 pr-10"
                                                {...passwordForm.register("currentPassword")}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.formState.errors.currentPassword && (
                                            <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder='***********'
                                                className="pl-9"
                                                {...passwordForm.register("newPassword")}
                                            />
                                        </div>

                                        {passwordForm.formState.errors.newPassword && (
                                            <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder='***********'
                                                className="pl-9"
                                                {...passwordForm.register("confirmPassword")}
                                            />
                                        </div>
                                        {passwordForm.formState.errors.confirmPassword && (
                                            <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-sm text-muted-foreground">
                                            Password must be at least 8 characters and include a mix of letters, numbers, and special characters.
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <div></div>
                                    <div className="flex items-center gap-4">
                                        {/* {isSaved && (
                                            <div className="flex items-center text-green-600 dark:text-green-400">
                                                <CheckCircle2 className="mr-1 h-4 w-4" />
                                                <span>Password updated successfully</span>
                                            </div>
                                        )} */}
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </>
                                            ) : (
                                                "Update Password"
                                            )}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </form>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Delete Account</CardTitle>
                                <CardDescription>
                                    Permanently delete your account and all associated data
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <AlertTriangle className="h-5 min-w-5 text-destructive mt-0.5 mr-3" />
                                        <div>
                                            <h3 className="font-medium text-destructive">Warning: This action cannot be undone</h3>
                                            <p className="text-sm text-destructive/80 mt-1">
                                                Deleting your account will permanently remove all your data, including your profile, resume templates, and settings. This action cannot be reversed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" onClick={handleDeleteAccount}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Delete Account
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>
                                    Manage how and when you receive notifications
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {userInfo?.notificationSettings?.map((notification, notIndex) => {
                                    return (

                                        <div className="space-y-4" key={notIndex}>

                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="email-notifications">{notification?.title}</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {notification?.description}
                                                    </p>
                                                </div>
                                                <Switch
                                                    id="email-notifications"
                                                    checked={notification?.value}
                                                    disabled={!notification.changeAllowed}
                                                    onCheckedChange={() => handleNotification(notification)}
                                                />
                                            </div>

                                            {/* <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="profile-updates">Profile Updates</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified when your profile is viewed or downloaded
                                            </p>
                                        </div>
                                        <Switch
                                            id="profile-updates"
                                            checked={profileUpdates}
                                            onCheckedChange={setProfileUpdates}
                                            disabled={!emailNotifications}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="new-templates">New Templates</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Get notified when new resume templates are available
                                            </p>
                                        </div>
                                        <Switch
                                            id="new-templates"
                                            checked={newTemplates}
                                            onCheckedChange={setNewTemplates}
                                            disabled={!emailNotifications}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="marketing-emails">Marketing Emails</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive updates about new features and promotions
                                            </p>
                                        </div>
                                        <Switch
                                            id="marketing-emails"
                                            checked={marketingEmails}
                                            onCheckedChange={setMarketingEmails}
                                            disabled={!emailNotifications}
                                        />
                                    </div> */}
                                        </div>
                                    )
                                })}
                            </CardContent>
                            <CardFooter>
                                <Button onClick={savePreferences}>Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="billing" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing Information</CardTitle>
                                <CardDescription>
                                    Manage your subscription and payment methods
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-card border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-medium">Current Plan</h3>
                                            <p className="text-sm text-muted-foreground">Free Plan</p>
                                        </div>
                                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                            Active
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Free Templates</span>
                                            <span>5</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Premium Templates</span>
                                            <span>Not included</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Profile Visibility</span>
                                            <span>Standard</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Button variant="outline" className="w-full">
                                            Upgrade to Professional
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-3">Payment Methods</h3>

                                    <div className="flex flex-wrap gap-4 items-center justify-between p-4 border rounded-lg mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 min-w-10 rounded-full bg-secondary flex items-center justify-center">
                                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">No payment method added</p>
                                                <p className="text-xs text-muted-foreground">Add a payment method to upgrade your plan</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Add Method
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-3">Billing History</h3>

                                    <div className="text-center p-6 border rounded-lg">
                                        <p className="text-muted-foreground">No billing history available</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
            {Boolean(isOpen) && (
                <Dialog open={Boolean(isOpen)}>
                    <DialogContent className="sm:max-w-md border-none outline-none max-w-[90vw] rounded-lg" hidden>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DialogHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-red-100">
                                        <Trash2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <DialogTitle className="text-xl text-red-700">Delete Account</DialogTitle>
                                </div>
                                <DialogDescription className="pt-4 text-base">
                                    Are you sure you want to delete your account? This action is <strong>permanent</strong> and cannot be undone.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-6 p-4 rounded-lg bg-red-50 border border-red-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="min-w-5 min-h-5 text-red-600 mt-0.5" />
                                    <p className="text-sm text-red-800">
                                        Deleting your account will <strong>permanently remove</strong> your profile from the system. This action cannot be reversed.
                                    </p>
                                </div>
                            </div>


                            <div className="flex justify-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpen(null)}
                                    className="gap-2 w-full"
                                >
                                    <ArrowBigRight className="w-4 h-4" />
                                    Abort
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => onDelete()}
                                    className="gap-2 w-full bg-red-700 hover:bg-red-800"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Confirm
                                </Button>
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}