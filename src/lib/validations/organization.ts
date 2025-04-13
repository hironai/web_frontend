import * as z from "zod";

export const organizationSchema = z.object({
    name: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(5, { message: "Please enter a valid phone number" }),
    website: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)),
    address: z.string().min(5, { message: "Address must be at least 5 characters" }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    state: z.string().min(2, { message: "State must be at least 2 characters" }),
    zipCode: z.string().min(3, { message: "Zip code must be at least 3 characters" }),
    country: z.string().min(2, { message: "Country must be at least 2 characters" }),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const employeeSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
});