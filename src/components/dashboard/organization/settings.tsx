"use client";

import { useContext, useState } from 'react';
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
import { Building2, Mail, Phone, Globe, MapPin, Lock, CreditCard, LogOut, Save, AlertTriangle, Trash2, ArrowBigRight, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ApplicationContext } from '@/context/applicationContext';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { useRouter } from 'next/navigation';
import { updateSettings_API } from '@/app/api/controller/dashboardController';
import { AddressType, NotificationSetting } from '@/types/dashboard';
import { deleteAccount_API, resetPassword_API } from '@/app/api/controller/userController';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { organizationSchema, passwordSchema } from '@/lib/validations/organization';


export default function OrgSettings() {
    const { userInfo, setUserInfo, setReloadDashboardData } = useContext(ApplicationContext) || {};
    const [notifications, setNotifications] = useState<NotificationSetting[]>(userInfo?.notificationSettings || []);
    const address: AddressType = userInfo?.address?.[0] ?? {};
    const [isOpen, setIsOpen] = useState(false);
    const route = useRouter();

    // Organization form
    const organizationForm = useForm<z.infer<typeof organizationSchema>>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            name: userInfo?.user?.name || "",
            email: userInfo?.user?.email || "",
            phone: userInfo?.personalDetails?.phone || "",
            website: userInfo?.personalDetails?.website || "",
            address: address.addressLine1 || address.addressLine2 || "",
            city: address.city || "",
            state: address.state || "",
            zipCode: address.postalCode || "",
            country: address.country || "",
        }
    });


    const updateData = async (
        data: any, 
        options: { isSetPassword?: boolean; isDeleteAccount?: boolean } = {}
    ) => {
        const { isSetPassword = false, isDeleteAccount = false } = options;  // Default values
        
        try {
            let response;
    
            if (isDeleteAccount) {
                response = await deleteAccount_API(); // ✅ Call delete account API
            } else if (isSetPassword) {
                response = await resetPassword_API({ ...data }); // ✅ Call reset password API
            } else {
                response = await updateSettings_API({ ...data }); // ✅ Call update settings API
            }
            
            const status = response.status ?? 500;
            const responseData = response.data.dashboard ?? {};            

            if (status !== HttpStatusCode.Ok) {
                toast.info(response.data.error);
            }
            if (status === HttpStatusCode.Ok) {
                setUserInfo({
                    ...userInfo, 
                    ...responseData
                });

                setReloadDashboardData(true)
                toast.info(isSetPassword ? "Passowrd Updated" : "Dashboard Updated");
            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error:any) {
            console.error("Error fetching employees:", error);
            toast.info(error?.error);
        }
    };

    // Password form
    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema)
    });

    const onOrganizationSubmit = (data: z.infer<typeof organizationSchema>) => {
        let sendData = {
            address: [{
                addressLine1: data.address,
                addressLine2: data.address,
                city: data.city,
                state: data.state,
                postalCode: data.zipCode,
                country: data.country,
                isPublic: false,
            }],
            personalDetails:{
                ...userInfo.personalDetails,
                website: data.website,
                phone: data.phone
            },
            name: data.name
        }
        
        updateData({ ...sendData });
    };

    const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
        updateData(data, {isSetPassword: true});
    };

    const handleDeleteAccount = () => {
        setIsOpen(false);
        updateData({}, { isDeleteAccount: true });
    };

    const handleNotificationSubmit = () => {
        updateData({ notificationSettings: notifications });
    }

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Organization Settings</h1>
                <p className="text-muted-foreground">Manage your organization's account settings</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Tabs defaultValue="organization">
                    <TabsList className="grid w-full md:grid-cols-3 grid-cols-2">
                        {/* <TabsList className="grid w-full md:grid-cols-4 grid-cols-2"> */}
                        <TabsTrigger value="organization">Organization</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        {/* <TabsTrigger value="billing">Billing</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="organization" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Organization Information</CardTitle>
                                <CardDescription>
                                    Update your organization's profile information
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={organizationForm.handleSubmit(onOrganizationSubmit)}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Organization Name</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                placeholder='e.g., Hiron AI Inc.'
                                                className="pl-9"
                                                {...organizationForm.register("name")}
                                            />
                                        </div>
                                        {organizationForm.formState.errors.name && (
                                            <p className="text-sm text-destructive">{organizationForm.formState.errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    disabled
                                                    placeholder='e.g., contact@hironai.com'
                                                    className="pl-9"
                                                    {...organizationForm.register("email")}
                                                />
                                            </div>
                                            {organizationForm.formState.errors.email && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    placeholder='e.g., +1 (555) 123-4567'
                                                    className="pl-9"
                                                    {...organizationForm.register("phone")}
                                                />
                                            </div>
                                            {organizationForm.formState.errors.phone && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.phone.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="website"
                                                placeholder='e.g., https://www.hironai.com'
                                                className="pl-9"
                                                {...organizationForm.register("website")}
                                            />
                                        </div>
                                        {organizationForm.formState.errors.website && (
                                            <p className="text-sm text-destructive">{organizationForm.formState.errors.website.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="address"
                                                className="pl-9"
                                                placeholder='e.g., 123 Main Street'
                                                {...organizationForm.register("address")}
                                            />
                                        </div>
                                        {organizationForm.formState.errors.address && (
                                            <p className="text-sm text-destructive">{organizationForm.formState.errors.address.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                placeholder='e.g., San Francisco'
                                                {...organizationForm.register("city")}
                                            />
                                            {organizationForm.formState.errors.city && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.city.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="state">State/Province</Label>
                                            <Input
                                                id="state"
                                                placeholder='e.g., CA'
                                                {...organizationForm.register("state")}
                                            />
                                            {organizationForm.formState.errors.state && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.state.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="zipCode">Zip/Postal Code</Label>
                                            <Input
                                                id="zipCode"
                                                placeholder='e.g., 94105'
                                                {...organizationForm.register("zipCode")}
                                            />
                                            {organizationForm.formState.errors.zipCode && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.zipCode.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            placeholder='e.g., United States'
                                            {...organizationForm.register("country")}
                                        />
                                        {organizationForm.formState.errors.country && (
                                            <p className="text-sm text-destructive">{organizationForm.formState.errors.country.message}</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit">
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </Button>
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
                                                type="password"
                                                placeholder='***********'
                                                className="pl-9"
                                                {...passwordForm.register("currentPassword")}
                                            />
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
                                                type="password"
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
                                                type="password"
                                                placeholder='***********'
                                                className="pl-9"
                                                {...passwordForm.register("confirmPassword")}
                                            />
                                        </div>
                                        {passwordForm.formState.errors.confirmPassword && (
                                            <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit">Update Password</Button>
                                </CardFooter>
                            </form>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Delete Account</CardTitle>
                                <CardDescription>
                                    Permanently delete your organization account and all associated data
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 mr-3" />
                                        <div>
                                            <h3 className="font-medium text-destructive">Warning: This action cannot be undone</h3>
                                            <p className="text-sm text-destructive/80 mt-1">
                                                Deleting your account will permanently remove all your organization data, employee records, and search history. This action cannot be reversed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" onClick={() => setIsOpen(true)}>
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
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium">Email Notifications</h3>
                                    {
                                        notifications.map((notification) =>
                                            <div className="flex items-center justify-between" key={notification._id}>
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="email-notifications">{notification.title}</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {notification.description}
                                                    </p>
                                                </div>
                                                <Switch
                                                    id={notification._id}
                                                    checked={notification.value}
                                                    disabled={!notification.changeAllowed}
                                                    onCheckedChange={(checked) =>
                                                        setNotifications((prev: NotificationSetting[]) =>
                                                            prev.map((notif) =>
                                                                notif._id === notification._id
                                                                    ? { ...notif, value: checked }
                                                                    : notif
                                                            )
                                                        )
                                                    }
                                                />
                                            </div>)
                                    }
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleNotificationSubmit}>Save Preferences</Button>
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
                                            <span>AI Searches</span>
                                            <span>10/day</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Regular Searches</span>
                                            <span>20/day</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Employee Database</span>
                                            <span>Unlimited</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <Button variant="outline" className="w-full">
                                            Upgrade Plan
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium mb-3">Payment Methods</h3>

                                    <div className="flex flex-wrap gap-4 items-center justify-between p-4 border rounded-lg mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="min-h-10 min-w-10 rounded-full bg-secondary flex items-center justify-center">
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

                {isOpen && (
                <Dialog open={isOpen}>
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
                                    onClick={() => setIsOpen(false)}
                                    className="gap-2 w-full"
                                >
                                    <ArrowBigRight className="w-4 h-4" />
                                    Abort
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteAccount()}
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
            </motion.div>
        </div>
    );
}