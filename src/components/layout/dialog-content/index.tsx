'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ApplicationContext } from '@/context/applicationContext';

import { AlertTriangle, Trash2 } from "lucide-react"
import { useContext } from 'react';


export const DeleteActionDialogContent = () => {
    const {activeTab}  = useContext(ApplicationContext)

    let sectionName = activeTab?.replace('templates','template')
    return (
        <>
            <DialogHeader>
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-red-100">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-xl text-red-700 capitalize">Delete {sectionName}</DialogTitle>
                </div>
                <DialogDescription
                    className="pt-4 text-base">
                    Are you sure you want to delete your {sectionName}? This action is <strong>permanent</strong> and cannot be undone.
                </DialogDescription>
            </DialogHeader>

            <div className="my-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                    <AlertTriangle
                        className="min-w-5 min-h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-800">
                        Deleting your {sectionName} will <strong>permanently remove</strong> your {sectionName} from the system. This action cannot be reversed.
                    </p>
                </div>
            </div>
        </>
    )
}