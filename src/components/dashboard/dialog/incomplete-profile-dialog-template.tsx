"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";


export function IncompleteProfileDialogTemplate({ profile }: any) {
  const route = useRouter();
  const { slug } = useParams<any>();

  function handleClose() {
    route.push("/dashboard")
  }

  function handleViewTemplates(){
    route.push(`/templates/preview/${slug}`)
  }
  
  return (
    <Dialog open={!profile}>
      <DialogContent className="sm:max-w-[425px]" hidden={true}>
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <DialogTitle>Incomplete Profile</DialogTitle>
          </div>
          <div className="pt-4 space-y-4">
            <p className="text-sm text-center">
              This candidate&apos;s profile is currently incomplete. To ensure the best opportunities,
              please complete all sections in your dashboard. 
            </p>
            <div className="flex justify-center pt-2 w-full gap-2 flex-wrap">
              <Button className="w-full" variant="outline" onClick={handleViewTemplates}>
                View Template Design
              </Button>
              <Button className="w-full" onClick={handleClose}>
                Complete Profile
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}