"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { feedbackSchema } from "@/lib/validations/feedback";
import { ScrollArea } from "../ui/scroll-area";
import { ApplicationContext } from "@/context/applicationContext";
import { useContext, useEffect, useState } from "react";
import { postFeedback_API } from "@/app/api/controller/feedbackController";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";


export function GlobalFeedbackDialog() {
  const [open, setOpen] = useState(false);
  const { userInfo,setUserInfo } = useContext(ApplicationContext);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
  
    if (userInfo?.askFeedback === true) {
      timeoutId = setTimeout(() => {
        setOpen(true);
      }, 5000); // wait for 5 seconds
    }
  
    return () => clearTimeout(timeoutId);
  }, [userInfo]);
  

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
  });

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    console.log(values);
    let body = { feed: values }
    try {

      let response = await postFeedback_API(body)
      const status = response.status ?? 500;
      const responseData = response.data ?? {};

      if (status !== HttpStatusCode.Ok) {
        toast.info(responseData.error);
      }
      if (status === HttpStatusCode.Ok) {
        toast.info(responseData.message);
        setOpen(false)
        setUserInfo({...userInfo,askFeedback:false})
      }

    }
    catch (error) {
      console.log(error)
    }

  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px] h-[90vh] flex flex-col p-0" hidden={true}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-medium tracking-tight text-primary">Product Feedback</DialogTitle>
          <DialogDescription>
            Help us improve our product by sharing your experience. Your feedback is valuable to us.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-6 px-6">
              <FormField
                control={form.control}
                name="satisfaction"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-primary">How satisfied are you with our product?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="very_satisfied" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Very Satisfied
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="satisfied" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Satisfied
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="neutral" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Neutral
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="dissatisfied" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Dissatisfied
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="very_dissatisfied" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Very Dissatisfied
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usageFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">How often do you use our product?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryUseCase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">What do you primarily use our product for?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your main use case..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps us understand how to better serve your needs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="improvements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">What could we improve?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your suggestions for improvement..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your suggestions help us make the product better.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wouldRecommend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">Would you recommend our product to others?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your answer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes, definitely</SelectItem>
                        <SelectItem value="maybe">Maybe</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}