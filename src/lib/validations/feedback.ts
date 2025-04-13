import * as z from "zod";

export const feedbackSchema = z.object({
  satisfaction: z.enum(["very_satisfied", "satisfied", "neutral", "dissatisfied", "very_dissatisfied"], {
    required_error: "Please select your satisfaction level",
  }),
  usageFrequency: z.string({
    required_error: "Please select how often you use the product",
  }),
  primaryUseCase: z.string({
    required_error: "Please tell us what you primarily use our product for",
  }).min(10, "Please provide at least 10 characters"),
  improvements: z.string().min(20, "Please provide at least 20 characters of feedback"),
  wouldRecommend: z.enum(["yes", "maybe", "no"], {
    required_error: "Please indicate if you would recommend our product",
  }),
});