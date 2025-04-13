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
import { Trophy, Calendar, Plus, Trash2, Save, CheckCircle2, Edit, AlertTriangle, ArrowBigRight, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { HttpStatusCode } from 'axios';
import { ApplicationContext } from '@/context/applicationContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { achievementEntrySchema } from '@/lib/validations/candidate';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';

export default function Achievements() {
    const { setUserInfo, userInfo } = useContext(ApplicationContext)
    const [isOpen, setIsOpen] = useState<any>(false);
    const [achievements, setAchievements] = useState<z.infer<typeof achievementEntrySchema>[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const scrollToAdd = useRef<HTMLDivElement | null>(null);

    // Form for editing/adding achievement
    const form = useForm<z.infer<typeof achievementEntrySchema>>({
        resolver: zodResolver(achievementEntrySchema),
        defaultValues: {
            title: "",
            description: "",
            date: "",
            issuer: ""
        }
    });

    const handleEdit = (id: string) => {
        setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        const achievement = achievements.find(ach => ach?._id === id);
        if (achievement) {
            form.reset(achievement);
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
            description: "",
            date: "",
            issuer: ""
        });
        setIsAdding(true);
        setIsEditing(null);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
    };


    useEffect(() => {
        setAchievements(userInfo?.achievements)
    }, [userInfo])

    const handleDelete = (id: string) => {
        setIsOpen(id)
    };


    const onDelete = async () => {
        let updatedEdu = achievements?.filter((filter) => filter?._id !== isOpen)
        let body = { achievements: [...updatedEdu] }
        console.log(body, 'achievements Body')
        await updateEducationData(body, updatedEdu, 'delete')


    };

    const onSubmit = async (data: z.infer<typeof achievementEntrySchema>) => {
        setIsSaving(true);
        console.log(userInfo?.achievements, data, 'achievements data')
        let body = {}
        if (isEditing) {
            let index = achievements?.findIndex((fi) => fi?._id === isEditing)
            achievements?.splice(index, 1, { ...data, _id: isEditing })
            Object.assign(body, { achievements: achievements })
        }
        else {
            Object.assign(body, { achievements: [...userInfo?.achievements, data] })
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
                console.log(response.data.achievements, 'checkEductionResponse')
                if (type === 'delete') {

                    setAchievements(updatedEdu)
                    setUserInfo({ ...userInfo, achievements: updatedEdu, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }
                else {
                    setAchievements([...achievements, ...responseData?.dashboard?.achievements]);
                    setUserInfo({ ...userInfo, achievements: responseData?.dashboard?.achievements, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
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

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';

        const [year, month] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Achievements</h1>
                <p className="text-muted-foreground">Showcase your awards, honors, and recognition</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap gap-4 justify-between items-center"
            >
                <h2 className="text-xl font-medium">Your Achievements</h2>
                <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Achievement
                </Button>
            </motion.div>

            {/* Achievements List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                {achievements.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No achievements added yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your awards, honors, and recognition to showcase your accomplishments
                            </p>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Achievement
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {achievements.map((achievement, achivIndex) => (
                                    <div
                                        key={achivIndex}
                                        className={`p-4 rounded-lg border ${isEditing === achievement?._id ? "border-primary bg-primary/5" : ""
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Trophy className="h-5 w-5 text-primary" />
                                                <h3 className="text-lg font-medium">{achievement.title}</h3>
                                            </div>
                                            <div className="flex items-center mt-2 md:mt-0">
                                                {achievement.date && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        <span>{formatDate(achievement.date)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {achievement.issuer && (
                                            <p className="text-sm text-muted-foreground mb-2">Issued by: {achievement.issuer}</p>
                                        )}

                                        <p className="mb-4">{achievement.description}</p>

                                        <div className="flex md:justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(achievement?._id || '')}
                                                disabled={isEditing !== null || isAdding}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(achievement?._id || '')}
                                                disabled={isEditing !== null || isAdding}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                                                <span className="text-destructive">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
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
                            <CardTitle>{isAdding ? "Add New Achievement" : "Edit Achievement"}</CardTitle>
                            <CardDescription>
                                {isAdding ? "Add details about your achievement or recognition" : "Update your achievement details"}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Achievement Title</Label>
                                    <div className="relative">
                                        <Trophy className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="title"
                                            className="pl-9"
                                            placeholder="e.g., Employee of the Year, Best Project Award"
                                            {...form.register("title")}
                                        />
                                    </div>
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="date"
                                                className="pl-9"
                                                type="month"
                                                placeholder="YYYY-MM"
                                                {...form.register("date")}
                                            />
                                        </div>
                                        {form.formState.errors.date && (
                                            <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="issuer">Issuer / Organization (Optional)</Label>
                                        <Input
                                            id="issuer"
                                            placeholder="e.g., Company Name, Conference, Institution"
                                            {...form.register("issuer")}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        rows={4}
                                        placeholder="Describe your achievement, what it was for, and its significance..."
                                        {...form.register("description")}
                                    />
                                    {form.formState.errors.description && (
                                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                                    )}
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
                                                {isAdding ? "Add Achievement" : "Save Changes"}
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
                            <DeleteActionDialogContent />
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