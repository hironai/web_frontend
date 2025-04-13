"use client";

import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, Plus, Trash2, Save, CheckCircle2, Edit, Link as LinkIcon,AlertTriangle, ArrowBigRight, RefreshCw } from 'lucide-react';
import { linkEntrySchema, publicationSchema } from '@/lib/validations/candidate';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ApplicationContext } from '@/context/applicationContext';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';

export default function PublicationsPage() {
  const { setUserInfo, userInfo } = useContext(ApplicationContext)
  const [isOpen, setIsOpen] = useState<any>(false);
  const [publications, setPublications] = useState<any>([]);
  const scrollToAdd = useRef<HTMLDivElement | null>(null);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const form = useForm<z.infer<typeof publicationSchema>>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: "",
      journal: "",
      year: "",
      doi: ""
    }
  });
  
  const handleEdit = (id: string) => {
     setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
    const publication = publications.find((pub:any) => pub?._id === id);
    if (publication) {
      form.reset(publication);
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
      journal: "",
      year: "",
      doi: ""
    });
    setIsAdding(true);
    setIsEditing(null);
  };
  
  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
  };
  
  useEffect(() => {
    setPublications(userInfo?.publications)
}, [userInfo])

const handleDelete = (id: string) => {
    setIsOpen(id)
};


const onDelete = async () => {
    let updatedEdu = publications?.filter((filter:any) => filter?._id !== isOpen)
    let body = { publications: [...updatedEdu] }
    await updateEducationData(body, updatedEdu, 'delete')


};

console.log(userInfo, 'publications DataContext')
const onSubmit = async (data: any) => {
    setIsSaving(true);
    console.log(userInfo?.publications, data, 'publications data')
    let body = {}
    if (isEditing) {
        let index = publications?.findIndex((fi:any) => fi?._id === isEditing)
        publications?.splice(index, 1, { ...data, _id: isEditing })
        Object.assign(body, { publications: publications })
    }
    else {
        Object.assign(body, { publications: [...userInfo?.publications, data] })
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
            console.log(response.data.publications, 'checkEductionResponse')
            if (type === 'delete') {

                setPublications(updatedEdu)
                setUserInfo({ ...userInfo, publications: updatedEdu , activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
            }
            else {
                setPublications([...publications, ...responseData?.dashboard?.publications]);
                setUserInfo({ ...userInfo, publications: responseData?.dashboard?.publications, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
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

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-medium tracking-tight text-primary">Publications</h1>
        <p className="text-muted-foreground">Manage your academic publications and research papers</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-xl font-semibold">Your Publications</h2>
        <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
          <Plus className="mr-2 h-4 w-4" />
          Add Publication
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {publications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No publications added yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your academic publications and research papers to showcase your work
              </p>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Publication
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {publications.map((publication:any, publiIndex:any) => (
                  <div 
                    key={publiIndex} 
                    className={`p-4 rounded-lg border ${
                      isEditing === publication?._id ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{publication.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {publication.journal} • {publication.year?.split('T')[0]}
                        </p>
                        {publication.doi && (
                          <a 
                            href={`https://doi.org/${publication.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center"
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            DOI: {publication.doi}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(publication?._id)}
                          disabled={isEditing !== null || isAdding}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(publication?._id)}
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
              <CardTitle>{isAdding ? "Add New Publication" : "Edit Publication"}</CardTitle>
              <CardDescription>
                {isAdding ? "Add details about your publication" : "Update your publication details"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Publication Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter the title of your publication"
                    {...form.register("title")} 
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="journal">Journal/Conference Name</Label>
                  <Input 
                    id="journal" 
                    placeholder="Enter the name of the journal or conference"
                    {...form.register("journal")} 
                  />
                  {form.formState.errors.journal && (
                    <p className="text-sm text-destructive">{form.formState.errors.journal.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="year">Publication Year</Label>
                    <Input 
                      id="year" 
                      placeholder="YYYY"
                      {...form.register("year")} 
                    />
                    {form.formState.errors.year && (
                      <p className="text-sm text-destructive">{form.formState.errors.year.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="doi">DOI</Label>
                    <Input 
                      id="doi" 
                      placeholder="Enter the DOI of your publication"
                      {...form.register("doi")} 
                    />
                    {form.formState.errors.doi && (
                      <p className="text-sm text-destructive">{form.formState.errors.doi.message}</p>
                    )}
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
                        {isAdding ? "Add Publication" : "Save Changes"}
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