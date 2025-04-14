"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RefreshCw } from "lucide-react";

interface AdBlockerDialogProps {
  isOpen: boolean;
}

export function AdBlockerDialog() {
const [isAdBlockerDetected, setIsAdBlockerDetected] = React.useState(false);
  const handleReload = () => {
    window.location.reload();
  };

  React.useEffect(() => {
    const detectAdBlocker = async () => {
      try {
        // Create a bait element
        const bait = document.createElement('div');
        bait.className = 'ads ad adsbox doubleclick ad-placement carbon-ads';
        bait.style.height = '1px';
        document.body.appendChild(bait);

        // Check after a short delay if the bait element was hidden or removed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const isBlocked = 
          bait.offsetHeight === 0 || 
          bait.offsetParent === null ||
          window.getComputedStyle(bait).display === 'none';

        setIsAdBlockerDetected(isBlocked);
        document.body.removeChild(bait);

      } catch (error) {
        setIsAdBlockerDetected(true);
      }
    };

    detectAdBlocker();
  }, []);

  return (
    <Dialog open={isAdBlockerDetected} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" hidden={true}>
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-6 w-6" />
            <DialogTitle>Ad Blocker Detected</DialogTitle>
          </div>
          <div className="pt-4 space-y-4">
            <p className="text-sm text-gray-600">
              We&apos;ve detected that you&apos;re using an ad blocker. Our platform relies on 
              non-intrusive ads to keep our services free. Please disable your ad blocker 
              to continue using all features.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <Button onClick={handleReload} className="gap-2" variant="destructive">
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}