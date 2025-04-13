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

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});