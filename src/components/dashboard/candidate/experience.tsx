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
import { Briefcase, Building2, Calendar, MapPin, Plus, Trash2, Save, CheckCircle2, Edit, X, AlertTriangle, ArrowBigRight, RefreshCw } from 'lucide-react';
import { ApplicationContext } from '@/context/applicationContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {toast} from "sonner";
import { HttpStatusCode } from 'axios';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { experienceEntrySchema } from '@/lib/validations/candidate';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';



type ExperienceEntry = z.infer<typeof experienceEntrySchema>;


export default function Experience() {
    // const [experiences, setExperiences] = useState<z.infer<typeof experienceEntrySchema>[]>([]);
    const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [newAchievement, setNewAchievement] = useState('');
    const { setUserInfo, userInfo } = useContext(ApplicationContext)
    const [isOpen, setIsOpen] = useState<any>(false);
    const scrollToAdd = useRef<HTMLDivElement | null>(null);

    // Form for editing/adding experience
    const form = useForm<z.infer<typeof experienceEntrySchema>>({
        resolver: zodResolver(experienceEntrySchema),
        defaultValues: {
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            achievements: []
        }
    });

    const handleEdit = (id: string) => {
     setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        const experience = experiences.find(exp => exp?._id === id);
        if (experience) {
            form.reset(experience);
            setIsEditing(id);
            setIsAdding(false);
        }
    };

    const handleAdd = () => {
        setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        form.reset({
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
            achievements: []
        });
        setIsAdding(true);
        setIsEditing(null);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
    };

    const addAchievement = () => {
        if (newAchievement.trim() === '') return;
        const currentAchievements = form.getValues().achievements || [];
        form.setValue('achievements', [...currentAchievements, newAchievement]);
        setNewAchievement('');
    };

    const removeAchievement = (index: number) => {
        const currentAchievements = form.getValues().achievements || [];
        form.setValue('achievements', currentAchievements.filter((_, i) => i !== index));
    };

    const experienceList: z.infer<typeof experienceEntrySchema>[] = userInfo?.experience ?? [];
    useEffect(() => {
        setExperiences(experienceList);
    }, [userInfo]);


    const handleDelete = (id: string) => {
        setIsOpen(id)
    };

    const onDelete = async () => {
        const updatedEdu: ExperienceEntry[] = experiences.filter(exp => exp._id !== isOpen);
        const body = { experience: [...updatedEdu] }
        await updateEducationData(body, updatedEdu, 'delete');    
      };

      
    const onSubmit = async (data: z.infer<typeof experienceEntrySchema>) => {
        setIsSaving(true);
        console.log(userInfo?.experience, data, 'experiences data')
        let body = {}
        if (isEditing) {
            let index = experiences?.findIndex((fi) => fi?._id === isEditing)
            experiences?.splice(index, 1, { ...data, _id: isEditing })
            Object.assign(body, { experience: experiences })
        }
        else {
            Object.assign(body, { experience: [...userInfo?.experience, data] })
        }
        await updateEducationData(body, [], 'add');


    };
    const updateEducationData = async (body: any, updatedEdu : any = [], type: string) => {
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

                    setExperiences(updatedEdu)
                    setUserInfo({ ...userInfo, experience: updatedEdu, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }
                else {
                    setExperiences([...experiences, ...responseData?.dashboard?.experience]);
                    setUserInfo({ ...userInfo, experience: responseData?.dashboard?.experience, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }

                setIsSaved(true);
                setTimeout(() => {
                    setIsSaved(false);
                    setIsEditing(null);
                    setIsAdding(false)
                    setIsOpen(false)
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
                <h1 className="text-3xl font-medium tracking-tight text-primary">Work Experience</h1>
                <p className="text-muted-foreground">Manage your professional work history</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap gap-4 justify-between items-center"
            >
                <h2 className="text-xl font-medium">Your Experience</h2>
                <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                </Button>
            </motion.div>

            {/* Experience List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                {experiences?.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No experience added yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your work experience to showcase your professional journey
                            </p>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Experience
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    experiences?.map((experience, expindex) => (
                        <Card key={expindex} className={isEditing === experience?._id ? "border-primary" : ""}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-medium">{experience.title}</h3>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-muted-foreground">
                                            <div className="flex items-center">
                                                <Building2 className="h-4 w-4 mr-1" />
                                                <span>{experience.company}</span>
                                            </div>
                                            <span className="hidden md:inline">•</span>
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                <span>{experience.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-2 md:mt-0">
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{formatDate(experience.startDate)} - {formatDate(experience.endDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="mb-4">{experience.description}</p>

                                {experience?.achievements?.length > 0 && (
                                    <div>
                                        <h4 className="font-medium mb-2">Key Achievements:</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {experience?.achievements?.map((achievement, index) => (
                                                <li key={index}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="flex md:justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(experience?._id || '')}
                                        disabled={isEditing !== null || isAdding}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(experience?._id || '')}
                                        disabled={isEditing !== null || isAdding}
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
                    ref={scrollToAdd}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>{isAdding ? "Add New Experience" : "Edit Experience"}</CardTitle>
                            <CardDescription>
                                {isAdding ? "Add details about your work experience" : "Update your work experience details"}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Job Title</Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="title"
                                                className="pl-9"
                                                placeholder="e.g., Senior Frontend Developer"
                                                {...form.register("title")}
                                            />
                                        </div>
                                        {form.formState.errors.title && (
                                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="company"
                                                className="pl-9"
                                                placeholder="e.g., Tech Solutions Inc."
                                                {...form.register("company")}
                                            />
                                        </div>
                                        {form.formState.errors.company && (
                                            <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="location"
                                                className="pl-9"
                                                placeholder="e.g., San Francisco, CA"
                                                {...form.register("location")}
                                            />
                                        </div>
                                        {form.formState.errors.location && (
                                            <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
                                        )}
                                    </div>

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
                                                Current Position
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
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Job Description</Label>
                                    <Textarea
                                        id="description"
                                        rows={4}
                                        placeholder="Describe your responsibilities and the scope of your role..."
                                        {...form.register("description")}
                                    />
                                    {form.formState.errors.description && (
                                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Key Achievements</Label>
                                   {form.watch('achievements')?.length !== 0 && <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-md">
                                        {form.watch('achievements')?.map((achievement, achIndex) => (
                                            <div key={achIndex} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 max-h-7 rounded-full text-sm">
                                                {achievement}
                                                <button
                                                    type="button"
                                                    onClick={() => removeAchievement(achIndex)}
                                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {(!form.watch('achievements') || form.watch('achievements')?.length === 0) && (
                                            <p className="text-sm text-muted-foreground">No achievements added yet. Add some key accomplishments below.</p>
                                        )}
                                    </div>}
                                    {form.formState.errors.achievements && (
                                        <p className="text-sm text-destructive">{form.formState.errors.achievements.message}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Add an achievement (e.g., Increased sales by 20%)"
                                            value={newAchievement}
                                            onChange={(e) => setNewAchievement(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addAchievement();
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button type="button" onClick={addAchievement}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
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
                                                {isAdding ? "Add Experience" : "Save Changes"}
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
                                    onClick={() => setIsOpen(false)}
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