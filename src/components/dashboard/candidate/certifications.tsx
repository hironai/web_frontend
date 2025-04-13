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
import { Award, Building2, Calendar, Globe, Plus, Trash2, Save, CheckCircle2, Edit, AlertTriangle, ArrowBigRight, RefreshCw } from 'lucide-react';
import { ApplicationContext } from '@/context/applicationContext';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { certificationEntrySchema } from '@/lib/validations/candidate';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';



export default function Certifications() {
    const { userInfo, setUserInfo } = useContext(ApplicationContext)
    const [certifications, setCertifications] = useState<z.infer<typeof certificationEntrySchema>[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isOpen, setIsOpen] = useState<any>(false);
    const scrollToAdd = useRef<HTMLDivElement | null>(null);

    // Form for editing/adding certification
    const form = useForm<z.infer<typeof certificationEntrySchema>>({
        resolver: zodResolver(certificationEntrySchema),
        defaultValues: {
            name: "",
            issuingOrganization: "",
            issueDate: "",
            expirationDate: "",
            credentialId: "",
            credentialUrl: "",
            description: ""
        }
    });

    const handleEdit = (id: string) => {
     setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
        const certification = certifications.find(cert => cert?._id === id);
        if (certification) {
            form.reset(certification);
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
            issuingOrganization: "",
            issueDate: "",
            expirationDate: "",
            credentialId: "",
            credentialUrl: "",
            description: ""
        });
        setIsAdding(true);
        setIsEditing(null);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
    };

    useEffect(() => {
        setCertifications(userInfo?.certifications)
    }, [userInfo])

    const handleDelete = (id: string) => {
        setIsOpen(id)
    };


    const onDelete = async () => {
        let updatedEdu = certifications?.filter((filter) => filter?._id !== isOpen)
        let body = { certifications: [...updatedEdu] }
        await updateEducationData(body, updatedEdu, 'delete')
    };

    const onSubmit = async (data: z.infer<typeof certificationEntrySchema>) => {
        setIsSaving(true);
        let body = {}
        if (isEditing) {
            let index = certifications?.findIndex((fi) => fi?._id === isEditing)
            certifications?.splice(index, 1, { ...data, _id: isEditing })
            Object.assign(body, { certifications: certifications })
        }
        else {
            Object.assign(body, { certifications: [...userInfo?.certifications, data] })
        }

        await updateEducationData(body, [], 'add')
    };

    const updateEducationData = async (body:any, updatedEdu:any= [], type:any) => {
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
                console.log(response.data.certifications, 'checkEductionResponse')
                if (type === 'delete') {

                    setCertifications(updatedEdu)
                    setUserInfo({ ...userInfo, certifications: updatedEdu, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                }
                else {
                    setCertifications([...certifications, ...responseData?.dashboard?.certifications]);
                    setUserInfo({ ...userInfo, certifications: responseData?.dashboard?.certifications, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })

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
        if (!dateString || dateString === 'no-expiration') return 'No Expiration';

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
                <h1 className="text-3xl font-medium tracking-tight text-primary">Certifications</h1>
                <p className="text-muted-foreground">Manage your professional certifications and credentials</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap gap-4 justify-between items-center"
            >
                <h2 className="text-xl font-medium">Your Certifications</h2>
                <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Certification
                </Button>
            </motion.div>

            {/* Certifications List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4"
            >
                {certifications.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No certifications added yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Add your professional certifications to showcase your expertise and credentials
                            </p>
                            <Button onClick={handleAdd}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Certification
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    certifications.map((certification, certiIndex) => (
                        <Card key={certiIndex} className={isEditing === certification?._id ? "border-primary" : ""}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-medium">{certification.name}</h3>
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-muted-foreground">
                                            <div className="flex items-center">
                                                <Building2 className="h-4 w-4 mr-1" />
                                                <span>{certification.issuingOrganization}</span>
                                            </div>
                                            {certification.credentialId && (
                                                <>
                                                    <span className="hidden md:inline">•</span>
                                                    <div className="flex items-center">
                                                        <span>ID: {certification.credentialId}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex  items-center mt-2 md:mt-0">
                                        <div className="flex flex-wrap gap-1 items-center text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>Issued: {formatDate(certification.issueDate)}</span>
                                            {certification.expirationDate && certification.expirationDate !== 'no-expiration' && (
                                                <span className="ml-2">• Expires: {formatDate(certification.expirationDate)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {certification.description && <p className="mb-4">{certification.description}</p>}

                                {certification.credentialUrl && (
                                    <div className="flex items-center text-sm text-primary mb-4">
                                        <Globe className="h-4 w-4 mr-1" />
                                        <a href={certification.credentialUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            View Credential
                                        </a>
                                    </div>
                                )}

                                <div className="flex md:justify-end gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(certification?._id || '')}
                                        disabled={isEditing !== null || isAdding}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(certification?._id || '')}
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
                            <CardTitle>{isAdding ? "Add New Certification" : "Edit Certification"}</CardTitle>
                            <CardDescription>
                                {isAdding ? "Add details about your professional certification" : "Update your certification details"}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Certification Name</Label>
                                        <div className="relative">
                                            <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                className="pl-9"
                                                placeholder="e.g., AWS Certified Developer"
                                                {...form.register("name")}
                                            />
                                        </div>
                                        {form.formState.errors.name && (
                                            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="issuingOrganization">Issuing Organization</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="issuingOrganization"
                                                className="pl-9"
                                                placeholder="e.g., Amazon Web Services"
                                                {...form.register("issuingOrganization")}
                                            />
                                        </div>
                                        {form.formState.errors.issuingOrganization && (
                                            <p className="text-sm text-destructive">{form.formState.errors.issuingOrganization.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="issueDate">Issue Date</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="issueDate"
                                                className="pl-9"
                                                type="month"
                                                placeholder="YYYY-MM"
                                                {...form.register("issueDate")}
                                            />
                                        </div>
                                        {form.formState.errors.issueDate && (
                                            <p className="text-sm text-destructive">{form.formState.errors.issueDate.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <Label htmlFor="expirationDate">Expiration Date</Label>
                                            <label className="text-sm flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={form.watch("expirationDate") === "no-expiration"}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            form.setValue("expirationDate", "no-expiration");
                                                        } else {
                                                            form.setValue("expirationDate", "");
                                                        }
                                                    }}
                                                />
                                                No Expiration
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="expirationDate"
                                                className="pl-9"
                                                type="month"
                                                placeholder="YYYY-MM"
                                                disabled={form.watch("expirationDate") === "no-expiration"}
                                                {...form.register("expirationDate")}
                                            />
                                        </div>
                                        {form.formState.errors.expirationDate && (
                                            <p className="text-sm text-destructive">{form.formState.errors.expirationDate.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="credentialId">Credential ID (Optional)</Label>
                                        <Input
                                            id="credentialId"
                                            placeholder="e.g., AWS-DEV-12345"
                                            {...form.register("credentialId")}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="credentialUrl">Credential URL (Optional)</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="credentialUrl"
                                                className="pl-9"
                                                placeholder="e.g., https://example.com/verify"
                                                {...form.register("credentialUrl")}
                                            />
                                        </div>
                                        {form.formState.errors.credentialUrl && (
                                            <p className="text-sm text-destructive">{form.formState.errors.credentialUrl.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description (Optional)</Label>
                                    <Textarea
                                        id="description"
                                        rows={3}
                                        placeholder="Describe what this certification covers or represents..."
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
                                                {isAdding ? "Add Certification" : "Save Changes"}
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