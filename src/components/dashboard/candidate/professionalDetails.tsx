"use client";

import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Briefcase, Building2, Clock, Save, CheckCircle2, Plus, X } from 'lucide-react';
import { ApplicationContext } from '@/context/applicationContext';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { useRouter } from 'next/navigation';
import { proDetails } from '@/types/dashboard';
import { professionalSchema } from '@/lib/validations/candidate';


export default function ProfessionalDetails() {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const { userInfo, setUserInfo } = useContext(ApplicationContext) || {};
    const route = useRouter();

    let userData: proDetails | null = userInfo.professionalDetails.length > 0 ? userInfo.professionalDetails[0] : null;


    // Form
    const form = useForm<z.infer<typeof professionalSchema>>({
        resolver: zodResolver(professionalSchema),
        defaultValues: {
            currentTitle: userData?.currentTitle || "",
            currentCompany: userData?.currentCompany || "",
            industry: userData?.industry || "",
            yearsOfExperience: userData?.yearsOfExperience || 0,
            skills: userData?.skills || [],
            summary: userData?.summary || ""
        }
    });

    const onSubmit = async (data: z.infer<typeof professionalSchema>) => {
        setIsSaving(true);

        try {
            setIsSaving(true);

            let sendData = {
                professionalDetails: {
                    currentTitle: data.currentTitle,
                    currentCompany: data.currentCompany,
                    industry: data.industry,
                    yearsOfExperience: data.yearsOfExperience,
                    skills: data.skills,
                    summary: data.summary
                }
            }

            let response = await updateCandidate_API({ ...sendData });

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                setUserInfo({ ...userInfo, 
                    activity: responseData?.dashboard?.activity,
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
        }
    };

    const addSkill = () => {
        if (newSkill.trim() === '') return;

        const currentSkills = form.getValues().skills || [];
        if (!currentSkills.includes(newSkill)) {
            form.setValue('skills', [...currentSkills, newSkill]);
        }
        setNewSkill('');
    };

    const removeSkill = (skillToRemove: string) => {
        const currentSkills = form.getValues().skills || [];
        form.setValue('skills', currentSkills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Professional Details</h1>
                <p className="text-muted-foreground">Manage your professional information and skills</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Current Position</CardTitle>
                            <CardDescription>
                                Information about your current role and industry
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="currentTitle">Current Job Title</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="currentTitle"
                                            placeholder='e.g., Software Engineer'
                                            className="pl-9"
                                            {...form.register("currentTitle")}
                                        />
                                    </div>
                                    {form.formState.errors.currentTitle && (
                                        <p className="text-sm text-destructive">{form.formState.errors.currentTitle.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="currentCompany">Current Company</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="currentCompany"
                                            className="pl-9"
                                            placeholder="Leave blank if not currently employed"
                                            {...form.register("currentCompany")}
                                        />
                                    </div>
                                    {form.formState.errors.currentCompany && (
                                        <p className="text-sm text-destructive">{form.formState.errors.currentCompany.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input
                                        id="industry"
                                        placeholder="e.g., Information Technology, Healthcare, Finance"
                                        {...form.register("industry")}
                                    />
                                    {form.formState.errors.industry && (
                                        <p className="text-sm text-destructive">{form.formState.errors.industry.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="yearsOfExperience"
                                            type="number"
                                            min="0"
                                            max="50"
                                            placeholder='e.g., 10'
                                            className="pl-9"
                                            {...form.register("yearsOfExperience", { valueAsNumber: true })}
                                        />
                                    </div>
                                    {form.formState.errors.yearsOfExperience && (
                                        <p className="text-sm text-destructive">{form.formState.errors.yearsOfExperience.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Skills</CardTitle>
                            <CardDescription>
                                Add your professional skills and competencies
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Current Skills</Label>
                                <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-md">
                                    {form.watch('skills')?.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="px-3 py-1 max-h-8">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="ml-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                    {(!form.watch('skills') || form.watch('skills').length === 0) && (
                                        <p className="text-sm text-muted-foreground">No skills added yet. Add some skills below.</p>
                                    )}
                                </div>
                                {form.formState.errors.skills && (
                                    <p className="text-sm text-destructive">{form.formState.errors.skills.message}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Add a skill (e.g., JavaScript, Project Management)"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill();
                                            }
                                        }}
                                    />
                                </div>
                                <Button type="button" onClick={addSkill}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Skill
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Professional Summary</CardTitle>
                            <CardDescription>
                                Write a brief summary of your professional background and expertise
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Textarea
                                    id="summary"
                                    rows={6}
                                    placeholder="Describe your professional background, key skills, and career highlights..."
                                    {...form.register("summary")}
                                />
                                {form.formState.errors.summary && (
                                    <p className="text-sm text-destructive">{form.formState.errors.summary.message}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    This summary will appear at the top of your resume and profile. It should be concise but comprehensive.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-wrap gap-4 justify-between">
                            <p className="text-sm text-muted-foreground">
                                {/* Last updated: {userInfo.updatedAt ? getLastActiveStatus(userInfo.updatedAt) : "N/A"}  */}
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