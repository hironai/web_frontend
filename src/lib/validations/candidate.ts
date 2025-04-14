import * as z from "zod";

export const achievementEntrySchema = z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    title: z.string().min(2, { message: "Title must be at least 2 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500, { message: "Description must be at most 500 characters" }),
    date: z.string().regex(/^\d{4}-\d{2}$/, { message: "Date must be in YYYY-MM format" }).optional(),
    issuer: z.string().optional()
});

export const addressSchema = z.object({
    addressLine1: z.string().min(2, { message: "Address line 1 must be at least 2 characters" }),
    addressLine2: z.string().optional(),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    state: z.string().min(2, { message: "State/Province must be at least 2 characters" }),
    postalCode: z.string().min(2, { message: "Postal/Zip code must be at least 2 characters" }),
    country: z.string().min(2, { message: "Country must be at least 2 characters" }),
    isPublic: z.boolean().default(false)
});

export const certificationEntrySchema = z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    name: z.string().min(2, { message: "Certification name must be at least 2 characters" }),
    issuingOrganization: z.string().min(2, { message: "Issuing organization must be at least 2 characters" }),
    issueDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "Issue date must be in YYYY-MM format" }),
    expirationDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "Expiration date must be in YYYY-MM format" }).or(z.literal("no-expiration")).optional(),
    credentialId: z.string().optional(),
    credentialUrl: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)).optional(),
    description: z.string().max(500, { message: "Description must be at most 500 characters" }).optional(),
});

export const educationEntrySchema = z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    degree: z.string().min(2, { message: "Degree must be at least 2 characters" }),
    fieldOfStudy: z.string().min(2, { message: "Field of study must be at least 2 characters" }),
    institution: z.string().min(2, { message: "Institution must be at least 2 characters" }),
    location: z.string().min(2, { message: "Location must be at least 2 characters" }),
    startDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "Start date must be in YYYY-MM format" }),
    endDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "End date must be in YYYY-MM format" }).or(z.literal("present")),
    gpa: z.string().optional(),
    description: z.string().max(500, { message: "Description must be at most 500 characters" }).optional(),
    publications: z.array(z.string()).optional(),
    thesis: z.string().optional(),
    advisors: z.array(z.string()).optional(),
    honors: z.array(z.string()).optional(),
    activities: z.array(z.string()).optional(),
});


export const experienceEntrySchema = z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    title: z.string().min(2, { message: "Job title must be at least 2 characters" }),
    company: z.string().min(2, { message: "Company name must be at least 2 characters" }),
    location: z.string().min(2, { message: "Location must be at least 2 characters" }),
    startDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "Start date must be in YYYY-MM format" }),
    endDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "End date must be in YYYY-MM format" }).or(z.literal("present")),
    description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(1000, { message: "Description must be at most 1000 characters" }),
    achievements: z.array(z.string().min(5, { message: "Achievement must be at least 5 characters" }))
});

export const languageSchema = z.object({
    name: z.string().min(2, { message: "Language name must be at least 2 characters" }),
    proficiency: z.enum(["Native", "Professional", "Intermediate"], {
        required_error: "Please select a proficiency level"
    })
});

export const linkEntrySchema = z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    title: z.string().min(2, { message: "Title must be at least 2 characters" }),
    url: z.string().url({ message: "Please enter a valid URL" }),
    type: z.enum(["website", "github", "linkedin", "twitter", "instagram", "youtube", "facebook", "other"], {
        required_error: "Please select a link type",
    })
});

export const personalSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    phone: z.string().min(5, { message: "Please enter a valid phone number" }),
    website: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter a valid date in YYYY-MM-DD format" }),
    headline: z.string().min(5, { message: "Headline must be at least 5 characters" }).max(100, { message: "Headline must be at most 100 characters" }),
    bio: z.string().min(10, { message: "Bio must be at least 10 characters" }).max(500, { message: "Bio must be at most 500 characters" }),
});

export const professionalSchema = z.object({
    currentTitle: z.string().min(2, { message: "Job title must be at least 2 characters" }),
    currentCompany: z.string().min(2, { message: "Company name must be at least 2 characters" }).optional(),
    industry: z.string().min(2, { message: "Industry must be at least 2 characters" }),
    yearsOfExperience: z.number()
        .min(0, { message: "Years of experience must be selected" })
        .max(50, { message: "Years of experience is too high" }),
    skills: z.array(z.string()).min(1, { message: "At least one skill is required" }),
    summary: z.string().min(50, { message: "Professional summary must be at least 50 characters" }).max(1000, { message: "Professional summary must be at most 1000 characters" }),
});

export const projectEntrySchema = z.object({
    id: z.string().optional(),
    _id: z.string().optional(),
    name: z.string().min(2, { message: "Project name must be at least 2 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(1000, { message: "Description must be at most 1000 characters" }),
    startDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "Start date must be in YYYY-MM format" }).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}$/, { message: "End date must be in YYYY-MM format" }).or(z.literal("present")).or(z.literal("")).optional(),
    projectUrl: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)).optional(),
    technologies: z.array(z.string()).min(1, { message: "At least one technology is required" }),
    role: z.string().optional(),
    responsibilities: z.array(z.string()).min(1, { message: "At least one responsibility is required" }),
});

export const publicationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  journal: z.string().min(2, { message: "Journal name must be at least 2 characters" }),
  year: z.string().regex(/^\d{4}$/, { message: "Year must be in YYYY format" }),
  doi: z.string().min(2, { message: "DOI must be at least 2 characters" }),
});

export const researchSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  institution: z.string().min(2, { message: "Institution name must be at least 2 characters" }),
  duration: z.string().min(2, { message: "Duration must be at least 2 characters" }),
  supervisor: z.string().min(2, { message: "Supervisor name must be at least 2 characters" }),
});

export const accountSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const skillSchema = z.object({
  name: z.string().min(2, { message: "Skill name must be at least 2 characters" }),
  level: z.number().min(0).max(100),
  _id: z.string().optional(),
});