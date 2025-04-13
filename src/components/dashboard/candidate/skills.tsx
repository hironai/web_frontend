"use client";

import { useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, Plus, Trash2, Save, CheckCircle2, Edit,AlertTriangle, ArrowBigRight, RefreshCw } from 'lucide-react';
import { skillSchema } from '@/lib/validations/candidate';
import { updateCandidate_API } from '@/app/api/controller/dashboardController';
import { ApplicationContext } from '@/context/applicationContext';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';

export default function SkillsPage() {
  const { setUserInfo, userInfo } = useContext(ApplicationContext)
  const [isOpen, setIsOpen] = useState<any>(false);
  const [skills, setSkills] = useState<any>([
    { id: "1", name: "React", level: 90 },
    { id: "2", name: "TypeScript", level: 85 },
    { id: "3", name: "Node.js", level: 80 }
  ]);
  const scrollToAdd = useRef<HTMLDivElement | null>(null);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const form = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      level: 50
    }
  });
  
  const handleEdit = (id: string) => {
     setTimeout(() => {
            scrollToAdd.current?.scrollIntoView({ behavior: 'smooth' })
        }, 500);
    const skill = skills.find((s:any) => s?._id === id);
    if (skill) {
      form.reset(skill);
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
      level: 50
    });
    setIsAdding(true);
    setIsEditing(null);
  };
  
  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
  };


  useEffect(() => {
    setSkills(userInfo?.skills)
}, [userInfo])

const handleDelete = (id: string) => {
    setIsOpen(id)
};


const onDelete = async () => {
    let updatedEdu = skills?.filter((filter:any) => filter?._id !== isOpen)
    let body = { skills: [...updatedEdu] }
    await updateEducationData(body, updatedEdu, 'delete')


};

console.log(userInfo, 'skills DataContext')
const onSubmit = async (data: z.infer<typeof skillSchema>) => {
    setIsSaving(true);
    console.log(userInfo?.skills, data, 'skills data')
    let body = {}
    if (isEditing) {
        let index = skills?.findIndex((fi:any) => fi?._id === isEditing)
        skills?.splice(index, 1, { ...data, _id: isEditing })
        Object.assign(body, { skills: skills })
    }
    else {
        Object.assign(body, { skills: [...userInfo?.skills, data] })
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
            console.log(response.data.skills, 'checkEductionResponse')
            if (type === 'delete') {

                setSkills(updatedEdu)
                setUserInfo({ ...userInfo, skills: updatedEdu , activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
            }
            else {
                setSkills([...skills, ...responseData?.dashboard?.skills]);
                setUserInfo({ ...userInfo, skills: responseData?.dashboard?.skills, activity: responseData?.dashboard?.activity, stats: responseData?.dashboard?.stats, })
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
        <h1 className="text-3xl font-medium tracking-tight text-primary">Skills</h1>
        <p className="text-muted-foreground">Manage your professional skills and expertise levels</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-xl font-semibold">Your Skills</h2>
        <Button onClick={handleAdd} disabled={isAdding || isEditing !== null}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {skills.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No skills added yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your professional skills to showcase your expertise
              </p>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Skill
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {skills.map((skill:any, skillIndex:any) => (
                  <div 
                    key={skillIndex} 
                    className={`p-4 rounded-lg border ${
                      isEditing === skill?._id ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">{skill.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(skill?._id)}
                          disabled={isEditing !== null || isAdding}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(skill?._id)}
                          disabled={isEditing !== null || isAdding}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Proficiency</span>
                        <span className="font-medium">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
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
              <CardTitle>{isAdding ? "Add New Skill" : "Edit Skill"}</CardTitle>
              <CardDescription>
                {isAdding ? "Add details about your skill" : "Update your skill details"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., React, Python, Project Management"
                    {...form.register("name")} 
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Proficiency Level: {form.watch("level")}%</Label>
                  <Slider
                    defaultValue={[form.watch("level")]}
                    max={100}
                    step={1}
                    onValueChange={(value) => form.setValue("level", value[0])}
                  />
                  {form.formState.errors.level && (
                    <p className="text-sm text-destructive">{form.formState.errors.level.message}</p>
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
                        {isAdding ? "Add Skill" : "Save Changes"}
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