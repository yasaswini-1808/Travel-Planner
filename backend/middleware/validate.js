import { z } from "zod";

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errorMessage =
      result.error.issues[0]?.message || "Invalid request body";
    return res.status(400).json({
      error: errorMessage,
    });
  }

  req.body = result.data;
  next();
};

export const authRegisterSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
  fullName: z.string().trim().max(100).optional().or(z.literal("")),
});

export const authLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z
      .string({ required_error: "Token is required" })
      .trim()
      .min(1, "Token is required"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const itinerarySaveSchema = z.object({
  source: z.string().trim().optional().nullable(),
  destination: z
    .string({ required_error: "Destination is required" })
    .trim()
    .min(1, "Destination is required"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  numberOfDays: z.coerce
    .number({ required_error: "numberOfDays is required" })
    .int("numberOfDays must be an integer")
    .min(1, "numberOfDays must be at least 1"),
  budget: z
    .string({ required_error: "Budget is required" })
    .trim()
    .min(1, "Budget is required"),
  companion: z
    .string({ required_error: "Companion is required" })
    .trim()
    .min(1, "Companion is required"),
  accommodation: z.string().trim().optional().nullable(),
  transport: z.string().trim().optional().nullable(),
  activities: z.array(z.string()).optional(),
  dietary: z.array(z.string()).optional(),
  specialRequests: z.string().trim().optional().nullable(),
  itineraryData: z.any().optional().nullable(),
  tripName: z.string().trim().optional().nullable(),
});

export const generateItinerarySchema = z.object({
  source: z
    .string({ required_error: "Source is required" })
    .trim()
    .min(1, "Source is required"),
  destination: z
    .string({ required_error: "Destination is required" })
    .trim()
    .min(1, "Destination is required"),
  date: z.string().trim().optional().nullable(),
  days: z.coerce
    .number({ required_error: "Days is required" })
    .int("Days must be an integer")
    .min(1, "Days must be at least 1")
    .max(30, "Days must be at most 30"),
  budget: z
    .string({ required_error: "Budget is required" })
    .trim()
    .min(1, "Budget is required"),
  companion: z
    .string({ required_error: "Companion is required" })
    .trim()
    .min(1, "Companion is required"),
  accommodation: z.string().trim().optional().nullable(),
  transport: z.string().trim().optional().nullable(),
  activities: z.array(z.string()).optional().default([]),
  dietary: z.array(z.string()).optional().default([]),
  specialRequests: z.string().trim().optional().nullable(),
});

export const bookingSearchSchema = z.object({
  source: z
    .string({ required_error: "Source is required" })
    .trim()
    .min(1, "Source is required"),
  destination: z
    .string({ required_error: "Destination is required" })
    .trim()
    .min(1, "Destination is required"),
  departureDate: z
    .string({ required_error: "Departure date is required" })
    .trim()
    .min(1, "Departure date is required"),
  returnDate: z.string().trim().optional().nullable(),
  passengers: z.coerce.number().int().min(1).max(10).optional().default(1),
});

export const ragQuerySchema = z.object({
  query: z
    .string({ required_error: "Query is required" })
    .trim()
    .min(2, "Query is required"),
  limit: z.coerce.number().int().min(1).max(10).optional(),
});

export const ragAnswerSchema = z.object({
  question: z
    .string({ required_error: "Question is required" })
    .trim()
    .min(2, "Question is required"),
});
