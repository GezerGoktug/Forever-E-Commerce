import { z } from "zod";

export const classifierAgentOutputSchema = z.object({
    userIntent: z.enum(["PRODUCT_LOOKUP", "GENERAL_INFO"]),
    message: z.string().nullable().optional(),
});
