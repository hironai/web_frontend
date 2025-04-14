import * as z from "zod";

export const signUpSchema = z.object({
    // name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    checkbox: z.boolean(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
}).refine((data) => data.checkbox, {
    message: "Please accept terms & privacy",
    path: ["checkbox"],
});;

export const signInSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email"),
});

// export const resetPasswordSchema = z.object({
//     password: z
//         .string()
//         .min(8, "Password must be at least 8 characters")
//         .regex(
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//             "Password must contain at least one uppercase letter, one lowercase letter, and one number"
//         ),
//     confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
// });

export const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});


export const candidateSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const organizationSchema = z.object({
    organizationName: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
    contactName: z.string().min(2, { message: "Contact name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    organizationType: z.enum(["Company", "University", "Government"], {
        required_error: "Please select an organization type",
    })
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});