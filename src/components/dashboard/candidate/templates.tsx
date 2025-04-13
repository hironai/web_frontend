"use client";

import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { FileText, Copy, Eye, Lock, Plus, Trash2, AlertTriangle, ArrowBigRight, RefreshCw } from 'lucide-react';
import { ApplicationContext } from '@/context/applicationContext';
import { getTemplate_API } from '@/app/api/controller/templateController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HOST_URL } from '@/app/api/constants';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';

export default function Templates() {
    const [activeTab, setActiveTab] = useState('my-templates');
    const [isOpen, setIsOpen] = useState<any>(false)
    const { userInfo, setUserInfo, templates, setTemplates } = useContext(ApplicationContext)

    useEffect(() => {
        getTemplates()
    }, [])

    const getTemplates = async () => {
        try {
            let response = await getTemplate_API()
            setTemplates(response.data?.templates)
            console.log(response, 'templatesGet')
        }
        catch (error) {
            console.log(error)
        }
    }


    const addTemplate = async (data: any) => {
        if (userInfo?.templates?.length >= 5) {
            toast.info('You can only add up to 5 templates. Please delete an existing template before adding a new one.');
        }
        else {
            let body = { templates:  [...userInfo?.templates,{ ...data,templateId: data?._id, status: 'active', view: 0 }] }
            console.log(body,data,'checkReponseForAddTempAdd')
            await updateTemplateData(body, 'add')
        }
    }
    const handleDelete = (id: any) => {
        setIsOpen(id)
    }
console.log(userInfo,'userInfo')
    const onDelete = () => {
        let newUserData = userInfo?.templates?.filter((filter) => filter?.templateId !== isOpen)
        let body = { templates: newUserData }
        updateTemplateData(body, 'delete')
    }

    const updateTemplateData = async (body: any, type: any) => {
        try {
            let response = await updateCandidate_API(body);

            // ✅ Ensure status is always a number by using fallback (e.g., 500)
            const status = response.status ?? 500;
            const responseData = response.data ?? {};
              console.log(responseData,'checkReponseForAddTemp')
            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                    setUserInfo({ ...userInfo,templates: responseData?.dashboard?.templates, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
                setIsOpen(null)
            }

        } catch (error) {
            console.log(error);
        }
    }



    const handleCopyLink = (url: string) => {
        navigator.clipboard.writeText(`${HOST_URL.url}/templates/preview/${url}?profile=${userInfo?.user?.userName}`);
        // Show toast notification
        toast.info('Link copied to clipboard')
    };

    const handleToggleActive = (templateId: string, currentState: string) => {
        // Toggle the 'status' field based on current string state
 
        const updatedTemplates = userInfo?.templates?.map((template) => {            
            if (template.templateId === templateId) {         
                const newStatus = template.status === "active" ? "inactive" : "active";

        return {
            ...template,
            status: newStatus,
        };
            }
            
            return template;
        });

        const body = { templates: updatedTemplates };   
        userInfo.templates = updatedTemplates; 
        updateTemplateData(body, 'delete')
    };


    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Resume Templates</h1>
                <p className="text-muted-foreground">Manage your resume templates and create new ones</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Tabs defaultValue="my-templates" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="my-templates">My Templates</TabsTrigger>
                        <TabsTrigger value="available-templates">Available Templates</TabsTrigger>
                    </TabsList>

                    <TabsContent value="my-templates" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userInfo?.templates.map((template, templIndex) => (
                                <Card key={templIndex}>
                                    <CardContent className="p-6">
                                        <div className="aspect-video w-full rounded-md bg-secondary mb-4 flex items-center justify-center">
                                            <FileText className="h-10 w-10 text-muted-foreground" />
                                        </div>

                                        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                                            <div>
                                                <h3 className="font-medium">{template?.name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {template?.premium ? 'Premium Template' : 'Free Template'}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-center gap-4">
                                            <div className='text-xs'>
                                                <Eye className="inline-block mr-1 h-4 w-4" /> {template?.views} views
                                            </div>
                                            <div className={`text-xs px-4 py-1 rounded-full ${template?.status === 'active'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                    }`}>
                                                    {template?.status}
                                                </div>
                                                
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                            {/* <div>
                                                <Eye className="inline-block mr-1 h-4 w-4" /> {template?.views} views
                                            </div> */}
                                            {/* <div>
                                                Updated {getLastActiveStatus(template?.updatedAt)}
                                            </div> */}
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <Label htmlFor={`active-${template?.id}`} className="text-sm">Active</Label>
                                            <Switch
                                                id={`active-${template?.id}`}
                                                checked={template.status === 'active'}
                                                onCheckedChange={() => handleToggleActive(template?._id, template?.active)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                            <Link href={`templates/preview/${template?.previewUrl}?profile=${userInfo?.user?.userName}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Preview
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleCopyLink(template?.previewUrl)}>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Copy Link
                                            </Button>
                                            {/* <Button variant="outline" size="sm" className="col-span-2">
                                                <Share2 className="mr-2 h-4 w-4" />
                                                Share Template
                                            </Button> */}
                                            <Button onClick={() => handleDelete(template?.templateId)} variant="outline" size="sm" className="col-span-2 text-destructive hover:text-white hover:bg-destructive ">
                                                {/* <Button onClick={() => handleDelete(template?.templateId)} variant="outline" size="sm" className="col-span-2 bg-destructive text-white hover:text-destructive hover:bg-transparent "> */}
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Remove Template
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {userInfo?.templates?.length < 5 && (
                                <Card className="border-dashed bg-muted/50">
                                    <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                                        <div className="rounded-full bg-primary/10 p-3 mb-3">
                                            <Plus className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-medium mb-1">Add New Template</h3>
                                        <p className="text-xs text-muted-foreground mb-4">
                                            You can add up to {5 - userInfo?.templates.length} more free templates
                                        </p>
                                        <Button asChild size="sm" onClick={() => setActiveTab('available-templates')}>
                                            <Link href="#available-templates" onClick={() => setActiveTab('available-templates')}>
                                                Browse Templates
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="available-templates" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {templates?.map((template, tempIndex) => (
                                <Card key={tempIndex}>
                                    <CardContent className="p-6">
                                        <div className="aspect-video w-full rounded-md bg-secondary mb-4 flex items-center justify-center relative">
                                            <FileText className="h-10 w-10 text-muted-foreground" />
                                            {template.premium && (
                                                <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                                                    Premium
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-medium">{template.name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {template.category}
                                                </p>
                                            </div>
                                            {template.premium ? (
                                                <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                                    {template.price}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                                    Free
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`templates/preview/${template?.previewUrl}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Preview
                                                </Link>
                                            </Button>
                                            {template.premium ? (
                                                <Button size="sm">
                                                    <Lock className="mr-2 h-4 w-4" />
                                                    Purchase
                                                </Button>
                                            ) : (
                                                <Button disabled={userInfo?.templates?.some((some) => some?.templateId === template?._id)} onClick={() => addTemplate(template)} size="sm">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Template
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </motion.div>
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