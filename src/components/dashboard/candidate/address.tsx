"use client";

import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Home, Building, Globe, Save, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { ApplicationContext } from '@/context/applicationContext';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import {toast} from "sonner";
import { HttpStatusCode } from 'axios';
import { getLastActiveStatus } from '@/lib/utils';
import { addressSchema } from '@/lib/validations/candidate';



export default function Address() {
    const { setUserInfo, userInfo } = useContext<any>(ApplicationContext)
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Form
    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            isPublic: false
        }
    });
    useEffect(() => {
        handleSetAddress()
    }, [userInfo])

    const handleSetAddress = () => {
        form.reset(userInfo?.address[0]);
    }
    const onSubmit = async (data: z.infer<typeof addressSchema>) => {
        setIsSaving(true);
        console.log("Address submitted:", data);

        await updateAddressData({ address: [data] })
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

    const updateAddressData = async (body: any) => {
        try {
            let response = await updateCandidate_API(body);

            console.log(response, "resp Eduction");

            // ✅ Ensure status is always a number by using fallback (e.g., 500)
            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                setUserInfo({ ...userInfo, address: responseData?.dashboard?.address, 
                    activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })

                setIsSaved(true);
                setTimeout(() => {
                    setIsSaved(false);
                    setIsSaving(false);

                }, 600);
            }

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
                <h1 className="text-3xl font-medium tracking-tight text-primary">Address</h1>
                <p className="text-muted-foreground">Manage your address information</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Address</CardTitle>
                            <CardDescription>
                                Add your address information for your profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="addressLine1">Address Line 1</Label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="addressLine1"
                                        className="pl-9"
                                        placeholder="Street address, P.O. box, company name"
                                        {...form.register("addressLine1")}
                                    />
                                </div>
                                {form.formState.errors.addressLine1 && (
                                    <p className="text-sm text-destructive">{form.formState.errors.addressLine1.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="addressLine2"
                                        className="pl-9"
                                        placeholder="Apartment, suite, unit, building, floor, etc."
                                        {...form.register("addressLine2")}
                                    />
                                </div>
                                {form.formState.errors.addressLine2 && (
                                    <p className="text-sm text-destructive">{form.formState.errors.addressLine2.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="city"
                                            className="pl-9"
                                            placeholder="e.g., San Francisco"
                                            {...form.register("city")}
                                        />
                                    </div>
                                    {form.formState.errors.city && (
                                        <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State / Province / Region</Label>
                                    <Input
                                        id="state"
                                        placeholder="e.g., California"
                                        {...form.register("state")}
                                    />
                                    {form.formState.errors.state && (
                                        <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">ZIP / Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        placeholder="e.g., 94105"
                                        {...form.register("postalCode")}
                                    />
                                    {form.formState.errors.postalCode && (
                                        <p className="text-sm text-destructive">{form.formState.errors.postalCode.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="country"
                                            className="pl-9"
                                            placeholder="e.g., United States"
                                            {...form.register("country")}
                                        />
                                    </div>
                                    {form.formState.errors.country && (
                                        <p className="text-sm text-destructive">{form.formState.errors.country.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isPublic"
                                    checked={form.watch("isPublic")}
                                    onCheckedChange={(checked) => form.setValue("isPublic", checked)}
                                />
                                <div className="space-y-0.5">
                                    <Label htmlFor="isPublic" className="flex items-center">
                                        {form.watch("isPublic") ? (
                                            <>
                                                <Eye className="mr-2 h-4 w-4 text-primary" />
                                                Make address public
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff className="mr-2 h-4 w-4 text-muted-foreground" />
                                                Keep address private
                                            </>
                                        )}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        {form.watch("isPublic")
                                            ? "Your full address will be visible on your public profile"
                                            : "Your address will be kept private and only city/country will be shown on your public profile"}
                                    </p>
                                </div>
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