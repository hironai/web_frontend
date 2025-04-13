"use client";

import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Plus, Trash2, Save, CheckCircle2, Edit,AlertTriangle, ArrowBigRight, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languageSchema, linkEntrySchema } from '@/lib/validations/candidate';
import { ApplicationContext } from '@/context/applicationContext';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';


export default function LanguagesPage() {
    const { setUserInfo, userInfo } = useContext(ApplicationContext)
    const [isOpen, setIsOpen] = useState<any>(false);
    const [languages, setLanguages] = useState<any>([
        { id: "1", name: "English", proficiency: "Native" },
        { id: "2", name: "Spanish", proficiency: "Professional" },
        { id: "3", name: "French", proficiency: "Intermediate" }
    ]);
    const scrollToAdd = useRef<HTMLDivElement | null>(null);

    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const form = useForm<z.infer<typeof languageSchema>>({
        resolver: zodResolver(languageSchema),
        defaultValues: {
            name: "",
            proficiency: "Intermediate"
        }
    });

    const handleEdit = (id: string) => {
     setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        const language = languages.find((l:any) => l?._id === id);
        if (language) {
            form.reset({
                name: language.name,
                proficiency: language.proficiency as "Native" | "Professional" | "Intermediate"
            });
            setIsEditing(id);
            setIsAdding(false);
        }
    };


    const handleAdd = () => {
        setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        form.reset({
            name: "",
            proficiency: "Intermediate"
        });
        setIsAdding(true);
        setIsEditing(null);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
    };

    useEffect(() => {
        setLanguages(userInfo?.languages)
    }, [userInfo])

    const handleDelete = (id: string) => {
        setIsOpen(id)
    };


    const onDelete = async () => {
        let updatedEdu = languages?.filter((filter:any) => filter?._id !== isOpen)
        let body = { languages: [...updatedEdu] }
        await updateEducationData(body, updatedEdu, 'delete')


    };

    console.log(userInfo, 'languages DataContext')
    const onSubmit = async (data: any) => {
        setIsSaving(true);
        
        let body = {}
        if (isEditing) {
            let index = languages?.findIndex((fi:any) => fi?._id === isEditing)
            languages?.splice(index, 1, { ...data, _id: isEditing })
            Object.assign(body, { languages: languages })
        }
        else {
            Object.assign(body, { languages: [...userInfo?.languages, data] })
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
                console.log(response.data.languages, 'checkEductionResponse')
                if (type === 'delete') {

                    setLanguages(updatedEdu)
                    setUserInfo({ ...userInfo, languages: updatedEdu , activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }
                else {
                    setLanguages([...languages, ...responseData?.dashboard?.languages]);
                    setUserInfo({ ...userInfo, languages: responseData?.dashboard?.languages, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
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

    const getProficiencyColor = (proficiency: string) => {
        switch (proficiency) {
            case 'Native':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'Professional':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Intermediate':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Languages</h1>
                <p className="text-muted-foreground">Manage your language proficiencies</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex justify-between items-center"
            >
                <h2 className="text-xl font-semibold">Your Languages</h2>
                <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Language
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                {languages.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No languages added yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your language proficiencies to showcase your communication skills
                            </p>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Language
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {languages.map((language:any, langIndex:any) => (
                                    <div
                                        key={langIndex}
                                        className={`p-4 rounded-lg border ${isEditing === language?._id ? "border-primary bg-primary/5" : ""
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Globe className="h-5 w-5 text-primary" />
                                                <div>
                                                    <h3 className="font-medium">{language.name}</h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className={getProficiencyColor(language.proficiency)}
                                                    >
                                                        {language.proficiency}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(language?._id)}
                                                    disabled={isEditing !== null || isAdding}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(language?._id)}
                                                    disabled={isEditing !== null || isAdding}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </motion.div>

            {(isAdding || isEditing !== null) && (
                <motion.div
                    ref={scrollToAdd}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>{isAdding ? "Add New Language" : "Edit Language"}</CardTitle>
                            <CardDescription>
                                {isAdding ? "Add details about your language proficiency" : "Update your language details"}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Language Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., English, Spanish, French"
                                        {...form.register("name")}
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                    )}
                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="proficiency">Proficiency Level</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            form.setValue("proficiency", value as "Native" | "Professional" | "Intermediate")
                                        }
                                        defaultValue={form.getValues("proficiency")}
                                    >

                                        <SelectTrigger id="proficiency" className="w-full">
                                            <SelectValue placeholder="Select proficiency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Native">Native</SelectItem>
                                            <SelectItem value="Professional">Professional</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {form.formState.errors.proficiency && (
                                        <p className="text-sm text-destructive">
                                            {form.formState.errors.proficiency.message}
                                        </p>
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
                                                {isAdding ? "Add Language" : "Save Changes"}
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