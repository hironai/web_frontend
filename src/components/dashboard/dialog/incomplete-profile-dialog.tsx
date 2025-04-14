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
import { ApplicationContext } from "@/context/applicationContext";
import { useRouter } from "next/navigation";


export function IncompleteProfileDialog({ profile }: any) {
  const route = useRouter();

  function handleClose() {
    route.push("/dashboard")
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
              This candidate&apos;s profile is currently incomplete. 
              If you are Candidate, To ensure the best opportunities,
              please complete all sections in your dashboard. 
              If you are Recruiter Please check back later or contact the candidate to complete their profile.
            </p>
            <div className="flex justify-center pt-2 w-full">
              <Button className="w-full" variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}