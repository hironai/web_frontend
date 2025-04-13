"use client";

import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Calendar, MapPin, Plus, Trash2, Save, CheckCircle2, Edit, GraduationCap, AlertTriangle, ArrowBigRight, RefreshCw, Users, Award, Activity, X, FileText } from 'lucide-react';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { ApplicationContext } from '@/context/applicationContext';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { DialogHeader } from '@/components/ui/dialog';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { educationEntrySchema } from '@/lib/validations/candidate';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';



export default function Education() {
    const { userInfo, setUserInfo } = useContext(ApplicationContext) || {};
    const [educations, setEducations] = useState<z.infer<typeof educationEntrySchema>[]>([]);
    const [isOpen, setIsOpen] = useState<any>(null)
    const addEdu = useRef<HTMLDivElement | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [newPublication, setNewPublication] = useState('');
    const [newAdvisor, setNewAdvisor] = useState('');
    const [newHonor, setNewHonor] = useState('');
    const [newActivity, setNewActivity] = useState('');

    // Form for editing/adding education
    const form = useForm<z.infer<typeof educationEntrySchema>>({
        resolver: zodResolver(educationEntrySchema),
        defaultValues: {
            degree: "",
            fieldOfStudy: "",
            institution: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
            description: "",
            publications: [],
            thesis: "",
            advisors: [],
            honors: [],
            activities: []
        }
    });

    const handleEdit = (id: string) => {
   
        const education = educations.find(edu => edu?._id === id);
        if (education) {
            form.reset(education);
            setIsEditing(id);
            setIsAdding(false);
            setTimeout(() => {
                addEdu.current?.scrollIntoView({ behavior: 'smooth' })
            }, 500);
        }
    };

    const handleAdd = () => {
        console.log('added Called', addEdu)
        setTimeout(() => {
            addEdu.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        form.reset({
            degree: "",
            fieldOfStudy: "",
            institution: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
            description: "",
            publications: [],
            thesis: "",
            advisors: [],
            honors: [],
            activities: []
        });
        setIsAdding(true);
        setIsEditing(null);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
    };

    useEffect(() => {
        setEducations(userInfo?.education)
    }, [userInfo])

    const handleDelete = (id: string) => {
        setIsOpen(id)
    };


    const onDelete = async () => {
        let updatedEdu = educations?.filter((filter) => filter?._id !== isOpen)
        let body = { education: [...updatedEdu] }
        await updateEducationData(body, updatedEdu, 'delete')
    };

    const addPublication = () => {
        if (newPublication.trim() === '') return;
        const currentPublications = form.getValues().publications || [];
        form.setValue('publications', [...currentPublications, newPublication]);
        setNewPublication('');
    };

    const removePublication = (index: number) => {
        const currentPublications = form.getValues().publications || [];
        form.setValue('publications', currentPublications.filter((_, i) => i !== index));
    };

    const addAdvisor = () => {
        if (newAdvisor.trim() === '') return;
        const currentAdvisors = form.getValues().advisors || [];
        form.setValue('advisors', [...currentAdvisors, newAdvisor]);
        setNewAdvisor('');
    };

    const removeAdvisor = (index: number) => {
        const currentAdvisors = form.getValues().advisors || [];
        form.setValue('advisors', currentAdvisors.filter((_, i) => i !== index));
    };

    const addHonor = () => {
        if (newHonor.trim() === '') return;
        const currentHonors = form.getValues().honors || [];
        form.setValue('honors', [...currentHonors, newHonor]);
        setNewHonor('');
    };

    const removeHonor = (index: number) => {
        const currentHonors = form.getValues().honors || [];
        form.setValue('honors', currentHonors.filter((_, i) => i !== index));
    };

    const addActivity = () => {
        if (newActivity.trim() === '') return;
        const currentActivities = form.getValues().activities || [];
        form.setValue('activities', [...currentActivities, newActivity]);
        setNewActivity('');
    };

    const removeActivity = (index: number) => {
        const currentActivities = form.getValues().activities || [];
        form.setValue('activities', currentActivities.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: z.infer<typeof educationEntrySchema>) => {
        setIsSaving(true);
        let body = {}
        if (isEditing) {
            let index = educations?.findIndex((fi) => fi?._id === isEditing)
            educations?.splice(index, 1, { ...data, _id: isEditing })
            Object.assign(body, { education: educations })
        }
        else {
            Object.assign(body, { education: [...userInfo?.education, data] })
        }

        await updateEducationData(body, [], 'add')
    };

    const updateEducationData = async (body: any, updatedEdu: any = [], type: any) => {
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
                if (type === 'delete') {
                    setEducations(updatedEdu)
                    setUserInfo({ ...userInfo, education: updatedEdu, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }
                else {
                    setEducations([...educations, ...responseData?.dashboard?.education]);
                    setUserInfo({ ...userInfo, education: responseData?.dashboard?.education, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }

                setIsSaved(true);
                setTimeout(() => {
                    setIsSaved(false);
                    setIsEditing(null);
                    setIsAdding(false)
                    setIsOpen(null)
                    setIsSaving(false);
                }, 600);
            }

        } catch (error) {
            console.log(error);
        }
    }



    const formatDate = (dateString: string) => {
        if (dateString === 'present') return 'Present';

        const [year, month] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Education</h1>
                <p className="text-muted-foreground">Manage your educational background</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap gap-4 justify-between items-center"
            >
                <h2 className="text-xl font-medium">Your Education</h2>
                <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Education
                </Button>
            </motion.div>

            {/* Education List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                {educations.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No education added yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your educational background to showcase your academic achievements
                            </p>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Education
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    educations.map((education, index) => (
                        <Card key={index} className={isEditing === education?._id ? "border-primary" : ""}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-medium">{education.degree} in {education.fieldOfStudy}</h3>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-muted-foreground">
                                            <div className="flex items-center">
                                                <Building2 className="h-4 w-4 mr-1" />
                                                <span>{education.institution}</span>
                                            </div>
                                            <span className="hidden md:inline">•</span>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span>{education.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-2 md:mt-0">
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{formatDate(education.startDate)} - {formatDate(education.endDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                {education.gpa && (
                                    <div className="mb-2">
                                        <span className="text-sm font-medium">GPA: </span>
                                        <span className="text-sm">{education.gpa}</span>
                                    </div>
                                )}

                                {education.description && <p className="mb-4">{education.description}</p>}

                                {education.thesis && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium mb-1">Thesis</h4>
                                        <p className="text-sm">{education.thesis}</p>
                                    </div>
                                )}

                                {education.publications && education.publications.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium mb-2">Publications</h4>
                                        <ul className="space-y-1">
                                            {education.publications.map((pub, index) => (
                                                <li key={index} className="text-sm flex items-start gap-2">
                                                    <FileText className="h-4 w-4 mt-0.5 text-primary" />
                                                    {pub}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {education.advisors && education.advisors.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium mb-2">Advisors</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {education.advisors.map((advisor, index) => (
                                                <Badge key={index} variant="secondary" className='py-1 px-3'>
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {advisor}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {education.honors && education.honors.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium mb-2">Honors & Awards</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {education.honors.map((honor, index) => (
                                                <Badge key={index} variant="secondary" className='py-1 px-3'>
                                                    <Award className="h-3 w-3 mr-1" />
                                                    {honor}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {education.activities && education.activities.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium mb-2">Activities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {education.activities.map((activity, index) => (
                                                <Badge key={index} variant="secondary" className='py-1 px-3'>
                                                    <Activity className="h-3 w-3 mr-1" />
                                                    {activity}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex md:justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(education?._id || '')}
                                    // disabled={isEditing !== null || isAdding}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(education?._id || '')}
                                    // disabled={isEditing !== null || isAdding}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                                        <span className="text-destructive">Delete</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </motion.div>

            {/* Add/Edit Form */}
            {(isAdding || isEditing !== null) && (
                <motion.div
                    ref={addEdu}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>{isAdding ? "Add New Education" : "Edit Education"}</CardTitle>
                            <CardDescription>
                                {isAdding ? "Add details about your educational background" : "Update your education details"}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="degree">Degree</Label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="degree"
                                                className="pl-9"
                                                placeholder="e.g., Bachelor of Science, Master of Arts"
                                                {...form.register("degree")}
                                            />
                                        </div>
                                        {form.formState.errors.degree && (
                                            <p className="text-sm text-destructive">{form.formState.errors.degree.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fieldOfStudy">Field of Study</Label>
                                        <Input
                                            id="fieldOfStudy"
                                            placeholder="e.g., Computer Science, Business Administration"
                                            {...form.register("fieldOfStudy")}
                                        />
                                        {form.formState.errors.fieldOfStudy && (
                                            <p className="text-sm text-destructive">{form.formState.errors.fieldOfStudy.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="institution">Institution</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="institution"
                                                className="pl-9"
                                                placeholder="e.g., Stanford University"
                                                {...form.register("institution")}
                                            />
                                        </div>
                                        {form.formState.errors.institution && (
                                            <p className="text-sm text-destructive">{form.formState.errors.institution.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                className="pl-9"
                                                placeholder="e.g., Stanford, CA"
                                                {...form.register("location")}
                                            />
                                        </div>
                                        {form.formState.errors.location && (
                                            <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="startDate"
                                                className="pl-9"
                                                type="month"
                                                placeholder="YYYY-MM"
                                                {...form.register("startDate")}
                                            />
                                        </div>
                                        {form.formState.errors.startDate && (
                                            <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label htmlFor="endDate">End Date</Label>
                                            <label className="text-sm flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={form.watch("endDate") === "present"}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            form.setValue("endDate", "present");
                                                        } else {
                                                            form.setValue("endDate", "");
                                                        }
                                                    }}
                                                />
                                                Currently Studying
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="endDate"
                                                className="pl-9"
                                                type="month"
                                                placeholder="YYYY-MM"
                                                disabled={form.watch("endDate") === "present"}
                                                {...form.register("endDate")}
                                            />
                                        </div>
                                        {form.formState.errors.endDate && (
                                            <p className="text-sm text-destructive">{form.formState.errors.endDate.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gpa">GPA (Optional)</Label>
                                        <Input
                                            id="gpa"
                                            placeholder="e.g., 3.8"
                                            {...form.register("gpa")}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        rows={3}
                                        placeholder="Describe your studies, achievements, or relevant coursework..."
                                        {...form.register("description")}
                                    />
                                    {form.formState.errors.description && (
                                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="thesis">Thesis (Optional)</Label>
                                    <Textarea
                                        id="thesis"
                                        rows={2}
                                        placeholder="Enter your thesis title or topic..."
                                        {...form.register("thesis")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Publications (Optional)</Label>
                                   {form.watch('publications')?.length !== 0 &&   <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-md mb-2">
                                        {form.watch('publications')?.map((pub, index) => (
                                            <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 max-h-7 rounded-full text-sm">
                                                {pub}
                                                <button
                                                    type="button"
                                                    onClick={() => removePublication(index)}
                                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add a publication..."
                                            value={newPublication}
                                            onChange={(e) => setNewPublication(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addPublication();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addPublication}>Add</Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Advisors (Optional)</Label>
                               {  form.watch('advisors')?.length !== 0 &&   <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-md mb-2">
                                        { form.watch('advisors')?.map((advisor, index) => (
                                            <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 max-h-7 rounded-full text-sm">
                                                {advisor}
                                                <button
                                                    type="button"
                                                    onClick={() => removeAdvisor(index)}
                                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add an advisor..."
                                            value={newAdvisor}
                                            onChange={(e) => setNewAdvisor(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addAdvisor();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addAdvisor}>Add</Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Honors & Awards (Optional)</Label>
                                   {form.watch('honors')?.length !== 0 &&   <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-md mb-2">
                                        {form.watch('honors')?.map((honor, index) => (
                                            <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 max-h-7 rounded-full text-sm">
                                                {honor}
                                                <button
                                                    type="button"
                                                    onClick={() => removeHonor(index)}
                                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add an honor or award..."
                                            value={newHonor}
                                            onChange={(e) => setNewHonor(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addHonor();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addHonor}>Add</Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Activities (Optional)</Label>
                              {form.watch('activities')?.length !== 0 &&        <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-md mb-2">
                                        {form.watch('activities')?.map((activity, index) => (
                                            <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 max-h-7 rounded-full text-sm">
                                                {activity}
                                                <button
                                                    type="button"
                                                    onClick={() => removeActivity(index)}
                                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add an activity..."
                                            value={newActivity}
                                            onChange={(e) => setNewActivity(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addActivity();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addActivity}>Add</Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button type="button" variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
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
                                                {isAdding ? "Add Education" : "Save Changes"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            )}
            {Boolean(isOpen) && (
                <Dialog open={Boolean(isOpen)}>
                    <DialogContent className="sm:max-w-md border-none outline-none max-w-[90vw] rounded-lg" hidden>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                         <DeleteActionDialogContent/>


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