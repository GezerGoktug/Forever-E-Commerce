import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "Username cannot be less than 3 characters"),
    email: z.string().email("Email is not in appropriate format"),
    password: z
      .string()
      .min(8, "Password cannot be less than 8 characters")
      .regex(
        /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
        "Password must contain at least 4 letters"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordsSchema = z.object({
  password: z
    .string()
    .min(8, "Password cannot be less than 8 characters")
    .regex(
      /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
      "Password must contain at least 4 letters"
    ),
});

export const deliveryInfoSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters long"),
  lastName: z.string().min(3, "Last name must be at least 3 characters long"),
  email: z.string().email("İnvalid email"),
  street: z.string().min(3, "Street must be at least 3 characters long"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z
    .string()
    .regex(
      /^0 \(\d{3}\) \d{3} \d{2} \d{2}$/,
      "Phone number must be '0 (999) 999 99 99' format."
    ),
  paymentMethod: z
    .string(z.enum(["CASH_ON_DELIVERY", "STRIPE"]))
    .default("CASH_ON_DELIVERY"),
});

export const productSchema = z.object({
  mainImage: z.any(),
  subImage1: z.any(),
  subImage2: z.any(),
  subImage3: z.any(),
  name: z.string().min(5, "Product name cannot be less than 5 characters."),
  description: z
    .string()
    .min(10, "Product description cannot be less than 10 characters."),
  category: z
    .enum(["Men", "Women", "Kids"], {
      errorMap: () => ({ message: "Please select a valid category." }),
    })
    .default("Men"),
  subCategory: z
    .enum(["Topwear", "Bottomwear", "Winterwear"], {
      errorMap: () => ({ message: "Please select a valid subcategory." }),
    })
    .default("Topwear"),
  price: z.number().min(1, "Product price cannot be less than 1"),
  sizes: z
    .array(z.enum(["SMALL", "MEDIUM", "LARGE", "XLARGE", "XXLARGE"]))
    .min(1, "There must be at least one product size"),
});

export const paginationRequestSchema = (maxPageSize: number = 30) => z.object({
  page: z.number().min(0, "Minimum page number can be 0"),
  pageSize: z.number()
    .min(0, "Minimum number of page elements can be 0")
    .max(maxPageSize, `Maximum number of page elements can be ${maxPageSize}`),
  sortType: z.enum(["asc", "desc", "default"], {
    errorMap: () => ({
      message: "Please select a valid sort type.(asc,desc,default)",
    }),
  }),
  sortField: z.string().nullable(),
});
