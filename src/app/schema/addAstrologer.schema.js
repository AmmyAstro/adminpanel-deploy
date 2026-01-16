import { z } from "zod";

export const addAstrologerSchema = z.object({
  astroname: z.string().min(2, "Name is required"),
  displayName: z.string().min(2, "Display name required"),
  hindiName: z.string().min(2, "Hindi name required"),

  phoneNumber: z.number(),
  email: z.string().email("Invalid email"),

  experience: z.number().min(0),

  gender: z.enum(["ml", "fe"]),

  address: z.string().min(10, "Address must be at least 10 characters"),
  pincode: z.number(),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
