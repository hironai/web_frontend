"use client";

import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Link as LinkIcon, Plus, Trash2, Save, CheckCircle2, Edit, Globe, Github, Linkedin, Twitter, Instagram, Youtube,
    Facebook, ExternalLink, AlertTriangle, ArrowBigRight, RefreshCw
} from 'lucide-react';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import {toast} from "sonner";
import { HttpStatusCode } from 'axios';
import { ApplicationContext } from '@/context/applicationContext';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { linkEntrySchema } from '@/lib/validations/candidate';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';


export default function Links() {
    const { setUserInfo, userInfo } = useContext(ApplicationContext)
    const [isOpen, setIsOpen] = useState<any>(false);
    const [links, setLinks] = useState<z.infer<typeof linkEntrySchema>[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const scrollToAdd = useRef<HTMLDivElement | null>(null);

    // Form for editing/adding link
    const form = useForm<z.infer<typeof linkEntrySchema>>({
        resolver: zodResolver(linkEntrySchema),
        defaultValues: {
            title: "",
            url: "",
            type: "website"
        }
    });

    const handleEdit = (id: string) => {
     setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        const link = links.find(l => l?._id === id);
        if (link) {
            form.reset(link);
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
            url: "",
            type: "website"
        });
        setIsAdding(true);
        setIsEditing(null);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
    };

    useEffect(() => {
        setLinks(userInfo?.links)
    }, [userInfo])

    const handleDelete = (id: string) => {
        setIsOpen(id)
    };


    const onDelete = async () => {
        let updatedEdu = links?.filter((filter) => filter?._id !== isOpen)
        let body = { links: [...updatedEdu] }
        await updateEducationData(body, updatedEdu, 'delete')


    };

    console.log(userInfo, 'links DataContext')
    const onSubmit = async (data: z.infer<typeof linkEntrySchema>) => {
        setIsSaving(true);
        console.log(userInfo?.links, data, 'links data')
        let body = {}
        if (isEditing) {
            let index = links?.findIndex((fi) => fi?._id === isEditing)
            links?.splice(index, 1, { ...data, _id: isEditing })
            Object.assign(body, { links: links })
        }
        else {
            Object.assign(body, { links: [...userInfo?.links, data] })
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
                console.log(response.data.links, 'checkEductionResponse')
                if (type === 'delete') {

                    setLinks(updatedEdu)
                    setUserInfo({ ...userInfo, links: updatedEdu , activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }
                else {
                    setLinks([...links, ...responseData?.dashboard?.links]);
                    setUserInfo({ ...userInfo, links: responseData?.dashboard?.links, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
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

    // Get icon based on link type
    const getLinkIcon = (type: string) => {
        switch (type) {
            case 'website':
                return <Globe className="h-4 w-4" />;
            case 'github':
                return <Github className="h-4 w-4" />;
            case 'linkedin':
                return <Linkedin className="h-4 w-4" />;
            case 'twitter':
                return <Twitter className="h-4 w-4" />;
            case 'instagram':
                return <Instagram className="h-4 w-4" />;
            case 'youtube':
                return <Youtube className="h-4 w-4" />;
            case 'facebook':
                return <Facebook className="h-4 w-4" />;
            default:
                return <ExternalLink className="h-4 w-4" />;
        }
    };

    // Get color based on link type
    const getLinkColor = (type: string) => {
        switch (type) {
            case 'website':
                return "text-blue-500";
            case 'github':
                return "text-gray-800 dark:text-gray-200";
            case 'linkedin':
                return "text-blue-600";
            case 'twitter':
                return "text-blue-400";
            case 'instagram':
                return "text-pink-500";
            case 'youtube':
                return "text-red-600";
            case 'facebook':
                return "text-blue-700";
            default:
                return "text-primary";
        }
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Links</h1>
                <p className="text-muted-foreground">Manage your professional and social media links</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex justify-between items-center"
            >
                <h2 className="text-xl font-medium">Your Links</h2>
                <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Link
                </Button>
            </motion.div>

            {/* Links List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                {links.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No links added yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your professional and social media links to enhance your profile
                            </p>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Link
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {links.map((link, LinkIndex) => (
                                    <div
                                        key={LinkIndex}
                                        className={`flex flex-wrap gap-4 items-center justify-between p-4 rounded-lg border ${isEditing === link?._id ? "border-primary bg-primary/5" : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`rounded-full p-2 bg-secondary ${getLinkColor(link.type)}`}>
                                                {getLinkIcon(link.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{link.title}</h3>
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-muted-foreground hover:text-primary truncate max-w-[200px] md:max-w-[300px] lg:max-w-[500px] inline-block"
                                                >
                                                    {link.url}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(link?._id || '')}
                                                disabled={isEditing !== null || isAdding}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(link?._id || '')}
                                                disabled={isEditing !== null || isAdding}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
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
                            <CardTitle>{isAdding ? "Add New Link" : "Edit Link"}</CardTitle>
                            <CardDescription>
                                {isAdding ? "Add a new professional or social media link" : "Update your link details"}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Link Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Personal Website, GitHub Profile"
                                        {...form.register("title")}
                                    />
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="url">URL</Label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="url"
                                            className="pl-9"
                                            placeholder="e.g., https://example.com"
                                            {...form.register("url")}
                                        />
                                    </div>
                                    {form.formState.errors.url && (
                                        <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Link Type</Label>
                                    <Controller
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select link type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="website">Personal Website</SelectItem>
                                                    <SelectItem value="github">GitHub</SelectItem>
                                                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                    <SelectItem value="twitter">Twitter</SelectItem>
                                                    <SelectItem value="instagram">Instagram</SelectItem>
                                                    <SelectItem value="youtube">YouTube</SelectItem>
                                                    <SelectItem value="facebook">Facebook</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {form.formState.errors.type && (
                                        <p className="text-sm text-destructive">
                                            {form.formState.errors.type.message}
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
                                                {isAdding ? "Add Link" : "Save Changes"}
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