import { z } from "zod";
const chargeField = z.number().min(0, "Must be ≥ 0");

const fileSchema = z.union([
  z.instanceof(File),
  z.string().url(),   
  z.null(),
]).optional();

const pricingItem = z.object({
  type: z.enum(["CHAT", "CALL", "VIDEO", "AUDIO"]),
  price: z.coerce.number().min(0).max(500),
 offerPrice: z.coerce.number().nullable().optional(),
  commissionPercent: z.coerce.number().min(0).max(100),
  isActive: z.boolean(),
});

export const addAstrologerSchema = z.object({
  astroname: z.string().min(2, "Name is required"),
  displayName: z.string().min(2, "Display name required"),

phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
 pincode: z.coerce.number().min(100000).max(999999),
  email: z.string().email("Invalid email"),

  experience: z.coerce.number().min(0),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  tzone: z.enum(["In", "Us"]),
  tags: z.enum([
    "New",
    "Rising Star",
    "Celebrity",
    "Top Ranking",
    "Top Choice",
  ]),

  vtags: z.enum(["verified", "not verified"]),

  countryStateCity: z.object({
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
  }),

  expertise: z.array(z.string()).min(1, "Select at least one expertise"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  problems: z.array(z.string()).min(1, "Select at least one problem"),

pricing: z.array(pricingItem).min(1, "At least one pricing required"),
  address: z.string().min(10, "Address must be at least 10 characters"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  aboutEnglish: z.string().min(20, "About is required"),

  bankDetails: z.object({
    accountHolderName: z.string().min(3, "Account holder name is required"),

    accountNumber: z.string().regex(/^[0-9]{9,18}$/, "Invalid account number"),

    bankName: z.string().min(2, "Bank name is required"),

    ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),

    panCardNumber: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),

    branchName: z.string().min(2, "Branch name is required"),
  }),
  documents: z.object({
    profilePic: fileSchema,
    aadhaar: fileSchema,
    panCard: fileSchema,
    passbook: fileSchema,
  }),
});
