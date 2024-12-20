import { z } from 'zod';

export const projectSettingsSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});

export const ratelimitChangeSchema = z.object({
  id: z.string().nonempty(),
  requests: z
    .string()
    .nonempty()
    .transform((val) => parseInt(val, 10)),
  duration: z
    .string()
    .nonempty()
    .transform((val) => parseInt(val, 10)),
});

export const customDataSchema = z.object({
  id: z.string().nonempty(),
  data: z.string().nonempty(),
});

export const githubSettingsSchema = z.object({
  id: z.string().nonempty(),
  github: z
    .string()
    .regex(
      /^https:\/\/github\.com\/[^\s\/]+\/[^\s\/]+[/]?$/,
      'Github URL must be "https://github.com/user/repo"'
    )
    .nonempty(),
});

export const githubTestIssueSchema = z.object({
  id: z.string().nonempty(),
});