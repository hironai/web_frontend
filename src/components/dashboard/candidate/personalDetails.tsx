"use client";

import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, Globe, Calendar, Save, CheckCircle2 } from 'lucide-react';
import { ApplicationContext } from '@/context/applicationContext';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { useRouter } from 'next/navigation';
import { updateCandidate_API, updateSettings_API } from '@/app/api/controller/dashboardController';
import { getLastActiveStatus } from '@/lib/utils';
import { personalSchema } from '@/lib/validations/candidate';



export default function PersonalDetails() {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { userInfo, setUserInfo } = useContext(ApplicationContext) || {};
    const route = useRouter();

    const fullName = userInfo?.user?.name?.trim() || "";
    const [firstName = "", lastName = ""] = fullName.split(" ");

    // Form
    const form = useForm<z.infer<typeof personalSchema>>({
        resolver: zodResolver(personalSchema),
        defaultValues: {
            firstName,
            lastName,
            email: userInfo?.user?.email || "",
            phone: userInfo?.personalDetails?.phone || "",
            website: userInfo?.personalDetails?.website || "",
            dateOfBirth: userInfo?.personalDetails?.dateOfBirth || "",
            headline: userInfo?.personalDetails?.headline || "",
            bio: userInfo?.personalDetails?.bio || "",
        }
    });

    const onSubmit = async (data: z.infer<typeof personalSchema>) => {
        try {
            setIsSaving(true);

            let sendData = {
                personalDetails: {
                    ...userInfo.personalDetails,
                    website: data.website,
                    phone: data.phone,
                    dateOfBirth: data.dateOfBirth,
                    headline: data.headline,
                    bio: data.bio,
                },
                name: data.firstName + " " + data.lastName,
            }

            let response = await updateCandidate_API({ ...sendData });

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {                
                toast.info(responseData.message);
                setUserInfo({ ...userInfo, activity: responseData?.dashboard?.activity,
                    user: responseData?.dashboard?.user,
                    personalDetails: responseData?.dashboard?.personalDetails,
                    updatedAt: responseData?.dashboard?.updatedAt,
                    stats: responseData?.dashboard?.stats,
                 });
            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setIsSaving(false);
            // setIsSaved(true);
        }
    };



    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Personal Details</h1>
                <p className="text-muted-foreground">Manage your personal information and contact details</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                This information will be displayed on your profile and resume
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="firstName"
                                            placeholder='e.g., John'
                                            className="pl-9"
                                            {...form.register("firstName")}
                                        />
                                    </div>
                                    {form.formState.errors.firstName && (
                                        <p className="text-sm text-destructive">{form.formState.errors.firstName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="lastName"
                                            placeholder='e.g., Doe'
                                            className="pl-9"
                                            {...form.register("lastName")}
                                        />
                                    </div>
                                    {form.formState.errors.lastName && (
                                        <p className="text-sm text-destructive">{form.formState.errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="headline">Professional Headline</Label>
                                <Input
                                    id="headline"
                                    placeholder="e.g., Senior Frontend Developer with 8+ years of experience"
                                    {...form.register("headline")}
                                />
                                {form.formState.errors.headline && (
                                    <p className="text-sm text-destructive">{form.formState.errors.headline.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    A brief headline that describes your professional role or expertise
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Professional Bio</Label>
                                <Textarea
                                    id="bio"
                                    rows={5}
                                    placeholder="Write a brief description about yourself, your skills, and your professional experience..."
                                    {...form.register("bio")}
                                />
                                {form.formState.errors.bio && (
                                    <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    A short bio that will appear at the top of your resume and profile
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        className="pl-9"
                                        {...form.register("dateOfBirth")}
                                    />
                                </div>
                                {form.formState.errors.dateOfBirth && (
                                    <p className="text-sm text-destructive">{form.formState.errors.dateOfBirth.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Your date of birth will not be displayed publicly
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                                How potential employers can reach you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        disabled
                                        placeholder='e.g., john@hironai.com'
                                        className="pl-9"
                                        {...form.register("email")}
                                    />
                                </div>
                                {form.formState.errors.email && (
                                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        placeholder='e.g., +1 555-123-4567'
                                        className="pl-9"
                                        {...form.register("phone")}
                                    />
                                </div>
                                {form.formState.errors.phone && (
                                    <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Personal Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="website"
                                        placeholder="https://yourwebsite.com"
                                        className="pl-9"
                                        {...form.register("website")}
                                    />
                                </div>
                                {form.formState.errors.website && (
                                    <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Optional: Add your personal website or portfolio
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-wrap gap-4 justify-between">
                            <p className="text-sm text-muted-foreground">
                                {/* Last updated: {userInfo.updatedAt ? getLastActiveStatus(userInfo.updatedAt) : "N/A"} */}
                            </p>
                            <div className="flex items-center gap-4">
                                {isSaved && (
                                    <div className="flex items-center text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="mr-1 h-4 w-4" />
                                        <span>Saved successfully</span>
                                    </div>
                                )}
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
                    </Card>
                </form>
            </motion.div>
        </div>
    );
}