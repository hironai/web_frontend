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
import {  Microscope, Plus, Trash2, Save,CheckCircle2,Edit,Building2,Calendar,User,AlertTriangle, ArrowBigRight, RefreshCw} from 'lucide-react';
import { researchSchema } from '@/lib/validations/candidate';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { ApplicationContext } from '@/context/applicationContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';

export default function ResearchPage() {
  const { setUserInfo, userInfo } = useContext(ApplicationContext)
  const [isOpen, setIsOpen] = useState<any>(false);
  const [research, setResearch] = useState<any>([
   
  ]);
  const scrollToAdd = useRef<HTMLDivElement | null>(null);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const form = useForm<z.infer<typeof researchSchema>>({
    resolver: zodResolver(researchSchema),
    defaultValues: {
      title: "",
      institution: "",
      duration: "",
      supervisor: ""
    }
  });
  
  const handleEdit = (id: string) => {
     setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
    const researchItem = research.find((item:any) => item?._id === id);
    if (researchItem) {
      form.reset(researchItem);
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
      institution: "",
      duration: "",
      supervisor: ""
    });
    setIsAdding(true);
    setIsEditing(null);
  };
  
  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
  };

  useEffect(() => {
    setResearch(userInfo?.research)
}, [userInfo])

const handleDelete = (id: string) => {
    setIsOpen(id)
};


const onDelete = async () => {
    let updatedEdu = research?.filter((filter:any) => filter?._id !== isOpen)
    let body = { research: [...updatedEdu] }
    await updateEducationData(body, updatedEdu, 'delete')


};

console.log(userInfo, 'research DataContext')
const onSubmit = async (data: z.infer<typeof researchSchema>) => {
    setIsSaving(true);
    console.log(userInfo?.research, data, 'research data')
    let body = {}
    if (isEditing) {
        let index = research?.findIndex((fi:any) => fi?._id === isEditing)
        research?.splice(index, 1, { ...data, _id: isEditing })
        Object.assign(body, { research: research })
    }
    else {
        Object.assign(body, { research: [...userInfo?.research, data] })
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
            console.log(response.data.research, 'checkEductionResponse')
            if (type === 'delete') {

                setResearch(updatedEdu)
                setUserInfo({ ...userInfo, research: updatedEdu , activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
            }
            else {
                setResearch([...research, ...responseData?.dashboard?.research]);
                setUserInfo({ ...userInfo, research: responseData?.dashboard?.research, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
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

  
  // const handleDelete = (id: string) => {
  //   if (confirm("Are you sure you want to delete this research entry?")) {
  //     setResearch(research.filter(item => item?._id !== id));
  //     if (isEditing === id) {
  //       setIsEditing(null);
  //     }
  //   }
  // };
  
  // const onSubmit = (data: z.infer<typeof researchSchema>) => {
  //   setIsSaving(true);
    
  //   setTimeout(() => {
  //     if (isEditing) {
  //       setResearch(research.map(item => item?._id === isEditing ? { ...data, id: isEditing } : item));
  //       setIsEditing(null);
  //     } else if (isAdding) {
  //       const newId = (Math.max(0, ...research.map(r => parseInt(r?._id || '0'))) + 1).toString();
  //       setResearch([...research, { ...data, id: newId }]);
  //       setIsAdding(false);
  //     }
      
  //     setIsSaving(false);
  //     setIsSaved(true);
      
  //     setTimeout(() => {
  //       setIsSaved(false);
  //     }, 3000);
  //   }, 1500);
  // };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-medium tracking-tight text-primary">Research</h1>
        <p className="text-muted-foreground">Manage your research projects and experiences</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-xl font-semibold">Your Research</h2>
        <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
          <Plus className="mr-2 h-4 w-4" />
          Add Research
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {research.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Microscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No research added yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your research projects and experiences to showcase your academic work
              </p>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Research
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {research.map((item:any, itemIndex:any) => (
                  <div 
                    key={itemIndex} 
                    className={`p-4 rounded-lg border ${
                      isEditing === item?._id ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {item.institution}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {item.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {item.supervisor}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(item?._id)}
                          disabled={isEditing !== null || isAdding}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(item?._id)}
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
              <CardTitle>{isAdding ? "Add New Research" : "Edit Research"}</CardTitle>
              <CardDescription>
                {isAdding ? "Add details about your research project" : "Update your research details"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Research Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter the title of your research project"
                    {...form.register("title")} 
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input 
                    id="institution" 
                    placeholder="Enter the name of the institution"
                    {...form.register("institution")} 
                  />
                  {form.formState.errors.institution && (
                    <p className="text-sm text-destructive">{form.formState.errors.institution.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input 
                      id="duration" 
                      placeholder="e.g., 2021-2023"
                      {...form.register("duration")} 
                    />
                    {form.formState.errors.duration && (
                      <p className="text-sm text-destructive">{form.formState.errors.duration.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Input 
                      id="supervisor" 
                      placeholder="Enter your supervisor's name"
                      {...form.register("supervisor")} 
                    />
                    {form.formState.errors.supervisor && (
                      <p className="text-sm text-destructive">{form.formState.errors.supervisor.message}</p>
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
                        {isAdding ? "Add Research" : "Save Changes"}
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