import { z } from "zod";

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
