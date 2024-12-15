import { z } from "zod";

export const projectSettingsSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
})

export const ratelimitChangeSchema = z.object({
  id: z.string().nonempty(),
  requests: z.string().nonempty().transform((val) => parseInt(val, 10)),
  duration: z.string().nonempty().transform((val) => parseInt(val, 10))
})

export const customDataSchema = z.object({
  id: z.string().nonempty(),
  data: z.string().nonempty()
})