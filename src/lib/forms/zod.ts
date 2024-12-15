import { z } from "zod";

export const createSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  github: z.string().url().nonempty(),
});
export type createSchemaType = z.infer<typeof createSchema>;