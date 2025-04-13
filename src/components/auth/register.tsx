"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Building2, User, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { signup_API } from '@/app/api/controller/userController';
import { toast } from "sonner";
import { HttpStatusCode } from 'axios';
import Image from 'next/image';


// Validation schemas
const candidateSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

const organizationSchema = z.object({
    organizationName: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
    contactName: z.string().min(2, { message: "Contact name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    organizationType: z.enum(["Company", "University", "Government"], {
        required_error: "Please select an organization type",
    })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export default function RegisterComponent() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('type') === 'organization' ? 'organization' : 'candidate';
    const [activeTab, setActiveTab] = useState(defaultTab);
    const route = useRouter()

    // Candidate form
    const candidateForm = useForm<z.infer<typeof candidateSchema>>({
        resolver: zodResolver(candidateSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    // Organization form
    const organizationForm = useForm<z.infer<typeof organizationSchema>>({
        resolver: zodResolver(organizationSchema),
        defaultValues: {
            organizationName: "",
            contactName: "",
            email: "",
            password: "",
            confirmPassword: "",
            organizationType: undefined
        }
    });

    const onCandidateSubmit = async (data: z.infer<typeof candidateSchema>) => {
        console.log("Candidate form submitted:", data);
        // Handle candidate registration
        await signupCandidate(data)

    };

    const onOrganizationSubmit = async (data: z.infer<typeof organizationSchema>) => {
        console.log("Organization form submitted:", data);
        // Handle organization registration
        await signupOrganization(data)

    };
    const signupOrganization = async (data: any) => {
        console.log(data, 'insideSigup')
        const { organizationName, contactName } = data
        let body = {
            ...data,
            name: organizationName,
            contactPerson: contactName,
            "role": "Organization",
        }
        try {
            let response = await signup_API(body)
            console.log(response, 'response org')
            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok && status !== HttpStatusCode.Created) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok || status === HttpStatusCode.Created) {
                toast.info(responseData.message);
                route.push('login')
            }
            if (status === HttpStatusCode.Unauthorized) {
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const signupCandidate = async (data: any) => {
        console.log(data, 'insideSigup')
        let body = {
            ...data,
            "role": "Candidate",
        }
        try {
            let response = await signup_API(body)
            console.log(response, 'response org')
            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok && status !== HttpStatusCode.Created) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok || status === HttpStatusCode.Created) {
                toast.info(responseData.message);
                route.push('login')
            }
            if (status === HttpStatusCode.Unauthorized) {
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <main className="flex-grow py-12 md:py-20">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                {/* <div className="flex flex-col items-center text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-medium tracking-tight mb-4"
                    >
                        Join Hiron AI
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-muted-foreground max-w-[600px]"
                    >
                        Create your account and start connecting with opportunities or finding the perfect candidates.
                    </motion.p>
                </div> */}
                <Link href="/" className="flex justify-center items-center gap-3 mb-6 w-fit mx-auto">
                            {/* <Clock className="h-12 w-12 text-primary" /> */}
                            <Image src="/assets/images/logo/logo.svg" alt="Hiron AI" width={50} height={50} />
                            <span className='text-3xl md:text-4xl font-medium tracking-tight'>Join Hiron AI</span>
                        </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-md mx-auto"
                >
                    <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-2 mb-8">
                            <TabsTrigger value="candidate" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Candidate</span>
                            </TabsTrigger>
                            <TabsTrigger value="organization" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                <span>Organization</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="candidate">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Candidate Registration</CardTitle>
                                    <CardDescription>
                                        Create your professional profile and showcase your skills to potential employers.
                                    </CardDescription>
                                </CardHeader>
                                <form onSubmit={candidateForm.handleSubmit(onCandidateSubmit)}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                {...candidateForm.register("name")}
                                            />
                                            {candidateForm.formState.errors.name && (
                                                <p className="text-sm text-destructive">{candidateForm.formState.errors.name.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                {...candidateForm.register("email")}
                                            />
                                            {candidateForm.formState.errors.email && (
                                                <p className="text-sm text-destructive">{candidateForm.formState.errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="***********"
                                                {...candidateForm.register("password")}
                                            />
                                            {candidateForm.formState.errors.password && (
                                                <p className="text-sm text-destructive">{candidateForm.formState.errors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="***********"
                                                {...candidateForm.register("confirmPassword")}
                                            />
                                            {candidateForm.formState.errors.confirmPassword && (
                                                <p className="text-sm text-destructive">{candidateForm.formState.errors.confirmPassword.message}</p>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex flex-col space-y-4">
                                        <Button type="submit" className="w-full">
                                            Create Account
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        <p className="text-sm text-center text-muted-foreground">
                                            Already have an account?{" "}
                                            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                                                Log in
                                            </Link>
                                        </p>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>

                        <TabsContent value="organization">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organization Registration</CardTitle>
                                    <CardDescription>
                                        Register your organization to find the perfect candidates for your positions.
                                    </CardDescription>
                                </CardHeader>
                                <form onSubmit={organizationForm.handleSubmit(onOrganizationSubmit)}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="organizationName">Organization Name</Label>
                                            <Input
                                                id="organizationName"
                                                placeholder="Hiron AI Inc."
                                                {...organizationForm.register("organizationName")}
                                            />
                                            {organizationForm.formState.errors.organizationName && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.organizationName.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="organizationType">Organization Type</Label>
                                            <Select
                                                onValueChange={(value) => organizationForm.setValue("organizationType", value as any)}
                                                value={organizationForm.watch("organizationType") || ""}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select organization type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Company">Company</SelectItem>
                                                    <SelectItem value="University">University</SelectItem>
                                                    <SelectItem value="Government">Government Agency</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {organizationForm.formState.errors.organizationType && (
                                                <p className="text-sm text-destructive">
                                                    {organizationForm.formState.errors.organizationType.message}
                                                </p>
                                            )}
                                        </div>



                                        {/* <div className="space-y-2">
                                        <Label htmlFor="organizationType">Organization Type</Label>
                                        <select
                                            id="organizationType"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...organizationForm.register("organizationType")}
                                        >
                                            <option value="">Select organization type</option>
                                            <option value="company">Company</option>
                                            <option value="university">University</option>
                                            <option value="government">Government Agency</option>
                                        </select>
                                        {organizationForm.formState.errors.organizationType && (
                                            <p className="text-sm text-destructive">{organizationForm.formState.errors.organizationType.message}</p>
                                        )}
                                    </div> */}

                                        <div className="space-y-2">
                                            <Label htmlFor="contactName">Contact Person Name</Label>
                                            <Input
                                                id="contactName"
                                                placeholder="Jane Smith"
                                                {...organizationForm.register("contactName")}
                                            />
                                            {organizationForm.formState.errors.contactName && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.contactName.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="orgEmail">Email</Label>
                                            <Input
                                                id="orgEmail"
                                                type="email"
                                                placeholder="contact@hironai.com"
                                                {...organizationForm.register("email")}
                                            />
                                            {organizationForm.formState.errors.email && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="orgPassword">Password</Label>
                                            <Input
                                                id="orgPassword"
                                                type="password"
                                                placeholder="***********"
                                                {...organizationForm.register("password")}
                                            />
                                            {organizationForm.formState.errors.password && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="orgConfirmPassword">Confirm Password</Label>
                                            <Input
                                                id="orgConfirmPassword"
                                                type="password"
                                                placeholder="***********"
                                                {...organizationForm.register("confirmPassword")}
                                            />
                                            {organizationForm.formState.errors.confirmPassword && (
                                                <p className="text-sm text-destructive">{organizationForm.formState.errors.confirmPassword.message}</p>
                                            )}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex flex-col space-y-4">
                                        <Button type="submit" className="w-full">
                                            Register Organization
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        <p className="text-sm text-center text-muted-foreground">
                                            Already have an account?{" "}
                                            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                                                Log in
                                            </Link>
                                        </p>
                                    </CardFooter>
                                </form>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </main>
    );
}