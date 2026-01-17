import { z } from "zod";
const chargeField = z
  .number()
  .min(0, "Must be ≥ 0");

  const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 1024 * 1024, "Max file size is 1MB");

export const addAstrologerSchema = z.object({
  astroname: z.string().min(2, "Name is required"),
  displayName: z.string().min(2, "Display name required"),
  hindiName: z.string().min(2, "Hindi name required"),

  phoneNumber: z.number(),
  email: z.string().email("Invalid email"),

  experience: z.number().min(0),

  gender: z.enum(["ml", "fe"]),
  tags: z.enum(["new", "rs", "cl", "tp", "tc"]),

  vtags: z.enum(["verify", "noverify"]),

  expertise: z.array(z.string()).min(1, "Select at least one expertise"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  problems: z.array(z.string()).min(1, "Select at least one problem"),

  charges: z.object({
    callCharges: chargeField.max(500),
    callCommission: chargeField.max(50),

    astro_video_charges: chargeField.max(500),
    video_commission: chargeField.max(50),

    offercallcharges: chargeField.max(500),
    offervideocharges: chargeField.max(50),
    disc_chat_charge: chargeField.max(50),

    gift_commission: chargeField.max(50),
  }),

  address: z.string().min(10, "Address must be at least 10 characters"),
  pincode: z.number(),

  password: z.string().min(6, "Password must be at least 6 characters"),

  bankDetails: z.object({
    accountHolderName: z
      .string()
      .min(3, "Account holder name is required"),

    accountNumber: z
      .string()
      .regex(/^[0-9]{9,18}$/, "Invalid account number"),

    bankName: z.string().min(2, "Bank name is required"),

    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),

    panCardNumber: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),

    branchName: z.string().min(2, "Branch name is required"),

    documents: z.object({
      profile: fileSchema,
      aadhar: fileSchema,
      pan: fileSchema,
      passbook: fileSchema,
    }),
  }),
});
