"use client";

import { useContext, useEffect, useRef, useState } from 'react';
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
import { FileText, Calendar, Globe, Plus, Trash2, Save, CheckCircle2, Edit, X, AlertTriangle, ArrowBigRight, RefreshCw, RollerCoaster, Dot } from 'lucide-react';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { ApplicationContext } from '@/context/applicationContext';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { projectEntrySchema } from '@/lib/validations/candidate';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';


export default function Projects() {
    const { setUserInfo, userInfo } = useContext(ApplicationContext)
    const [projects, setProjects] = useState<z.infer<typeof projectEntrySchema>[]>([]);

    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isOpen, setIsOpen] = useState<any>(false);
    const [newTechnology, setNewTechnology] = useState('');
    const [newResponsibilities, setNewResponsibilities] = useState('');
    const scrollToAdd = useRef<HTMLDivElement | null>(null);

    // Form for editing/adding project
    const form = useForm<z.infer<typeof projectEntrySchema>>({
        resolver: zodResolver(projectEntrySchema),
        defaultValues: {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            projectUrl: "",
            technologies: [],
            role: "",
            responsibilities: [],
        }
    });

    const handleEdit = (id: string) => {
     setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        const project = projects.find(proj => proj?._id === id);
        if (project) {
            form.reset(project);
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
            description: "",
            startDate: "",
            endDate: "",
            projectUrl: "",
            technologies: [],
            role: "",
            responsibilities: [],
        });
        setIsAdding(true);
        setIsEditing(null);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
    };


    const addTechnology = () => {
        if (newTechnology.trim() === '') return;

        const currentTechnologies = form.getValues().technologies || [];
        if (!currentTechnologies.includes(newTechnology)) {
            form.setValue('technologies', [...currentTechnologies, newTechnology]);
        }
        setNewTechnology('');
    };

    const removeTechnology = (techToRemove: string) => {
        const currentTechnologies = form.getValues().technologies || [];
        form.setValue('technologies', currentTechnologies.filter(tech => tech !== techToRemove));
    };



    const addResponsibilities = () => {
        if (newResponsibilities.trim() === '') return;

        const currentResponsibilities = form.getValues().responsibilities || [];
        if (!currentResponsibilities.includes(newResponsibilities)) {
            form.setValue('responsibilities', [...currentResponsibilities, newResponsibilities]);
        }
        setNewResponsibilities('');
    };

    const removeResponsibilities = (techToRemove: string) => {
        const currentResponsibilities = form.getValues().responsibilities || [];
        form.setValue('responsibilities', currentResponsibilities.filter(respo => respo !== techToRemove));
    };

    useEffect(() => {
        setProjects(userInfo?.projects)
    }, [userInfo])

    const handleDelete = (id: string) => {
        setIsOpen(id)
    };


    const onDelete = async () => {
        let updatedEdu = projects?.filter((filter) => filter?._id !== isOpen)
        let body = { projects: [...updatedEdu] }
        await updateEducationData(body, updatedEdu, 'delete')
    };

    const onSubmit = async (data: z.infer<typeof projectEntrySchema>) => {
        setIsSaving(true);

        let body = {}
        if (isEditing) {
            let index = projects?.findIndex((fi) => fi?._id === isEditing)
            projects?.splice(index, 1, { ...data, _id: isEditing })
            Object.assign(body, { projects: projects })
        }
        else {
            Object.assign(body, { projects: [...userInfo?.projects, data] })
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

                    setProjects(updatedEdu)
                    setUserInfo({ ...userInfo, projects: updatedEdu, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }
                else {
                    setProjects([...projects, ...responseData?.dashboard?.projects]);
                    setUserInfo({ ...userInfo, projects: responseData?.dashboard?.projects, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
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
                <h1 className="text-3xl font-medium tracking-tight text-primary">Projects</h1>
                <p className="text-muted-foreground">Showcase your personal and professional projects</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex justify-between items-center"
            >
                <h2 className="text-xl font-medium">Your Projects</h2>
                <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                </Button>
            </motion.div>

            {/* Projects List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No projects added yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your personal or professional projects to showcase your work
                            </p>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Project
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    projects.map((project, proIndex) => (
                        <Card key={proIndex} className={isEditing === project?._id ? "border-primary" : ""}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-medium">{project.name}</h3>
                                        {(project.startDate || project.endDate) && (
                                            <div className="flex items-center text-muted-foreground">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>
                                                    {project.startDate ? formatDate(project.startDate) : ''}
                                                    {project.startDate && project.endDate ? ' - ' : ''}
                                                    {project.endDate ? formatDate(project.endDate) : ''}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {project.projectUrl && (
                                        <div className="flex items-center mt-2 md:mt-0">
                                            <a
                                                href={project.projectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-primary hover:underline"
                                            >
                                                <Globe className="h-4 w-4 mr-1" />
                                                <span>View Project</span>
                                            </a>
                                        </div>
                                    )}

                                </div>

                                {project.role && (
                                    <div className="flex items-center mt-2 md:mt-0">
                                        <RollerCoaster className="h-4 w-4 mr-1" />
                                        <span>Role: {project.role}</span>
                                    </div>
                                )}

                                <p className="my-4">{project.description}</p>
                                <div className="flex flex-col gap-2 my-4">
                                    {project.responsibilities.map((respobi, respoIndex) => (
                                        <p key={respoIndex} className="flex items-center">
                                            <Dot className="" />
                                            {respobi}
                                        </p>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2 my-4">
                                    {project.technologies.map((tech, index) => (
                                        <Badge key={index} variant="secondary">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>


                                <div className="flex md:justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(project?._id || '')}
                                        disabled={isEditing !== null || isAdding}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(project?._id || '')}
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
                            <CardTitle>{isAdding ? "Add New Project" : "Edit Project"}</CardTitle>
                            <CardDescription>
                                {isAdding ? "Add details about your project" : "Update your project details"}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Project Name</Label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                className="pl-9"
                                                placeholder="e.g., E-commerce Platform"
                                                {...form.register("name")}
                                            />
                                        </div>
                                        {form.formState.errors.name && (
                                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role (Optional)</Label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="role"
                                                className="pl-9"
                                                placeholder="e.g., Product Manager, Developer"
                                                {...form.register("role")}
                                            />
                                        </div>
                                        {form.formState.errors.name && (
                                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                            <Label htmlFor="endDate">End Date (Optional)</Label>
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
                                                Ongoing Project
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
                                        <Label htmlFor="projectUrl">Project URL (Optional)</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="projectUrl"
                                                className="pl-9"
                                                placeholder="e.g., https://github.com/username/project"
                                                {...form.register("projectUrl")}
                                            />
                                        </div>
                                        {form.formState.errors.projectUrl && (
                                            <p className="text-sm text-destructive">{form.formState.errors.projectUrl.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Project Description</Label>
                                    <Textarea
                                        id="description"
                                        rows={4}
                                        placeholder="Describe your project, its purpose, and your role in it..."
                                        {...form.register("description")}
                                    />
                                    {form.formState.errors.description && (
                                        <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Technologies Used</Label>
                                  {form.watch('technologies')?.length !== 0 &&  <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-md">
                                        {form.watch('technologies')?.map((tech, Techindex) => (
                                            <Badge key={Techindex} variant="secondary" className="px-3 max-h-8 py-1">
                                                {tech}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTechnology(tech)}
                                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {(!form.watch('technologies') || form.watch('technologies').length === 0) && (
                                            <p className="text-sm text-muted-foreground">No technologies added yet. Add the technologies used in this project below.</p>
                                        )}
                                    </div>}
                                    {form.formState.errors.technologies && (
                                        <p className="text-sm text-destructive">{form.formState.errors.technologies.message}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Add a technology (e.g., React, Node.js, Python)"
                                            value={newTechnology}
                                            onChange={(e) => setNewTechnology(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTechnology();
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button type="button" onClick={addTechnology}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
                                </div>


                                <div className="space-y-2">
                                    <Label>Responsibilities</Label>
                                  {form.watch('responsibilities')?.length !== 0 &&  <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-md">
                                        {form.watch('responsibilities')?.map((respo, respoindex) => (
                                            <Badge key={respoindex} variant="secondary" className="px-3 max-h-8 py-1">
                                                {respo}
                                                <button
                                                    type="button"
                                                    onClick={() => removeResponsibilities(respo)}
                                                    className="ml-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                        {(!form.watch('responsibilities') || form.watch('responsibilities')?.length === 0) && (
                                            <p className="text-sm text-muted-foreground">No responsibilities added yet. Add the responsibilities used in this project below.</p>
                                        )}
                                    </div>}
                                    {form.formState.errors.responsibilities && (
                                        <p className="text-sm text-destructive">{form.formState.errors.responsibilities.message}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Add a technology (e.g., Managed and designed projects, Developed features)"
                                            value={newResponsibilities}
                                            onChange={(e) => setNewResponsibilities(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addResponsibilities();
                                                }
                                            }}
                                        />
                                    </div>
                                    <Button type="button" onClick={addResponsibilities}>
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
                                                {isAdding ? "Add Project" : "Save Changes"}
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