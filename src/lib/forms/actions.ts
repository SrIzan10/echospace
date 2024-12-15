'use server'

import { customDataSchema, projectSettingsSchema, ratelimitChangeSchema } from "@/components/app/UniversalForm/zod";
import { validateRequest } from "../auth";
import prisma from "../db";
import zodVerify from "../zodVerify";
import { createSchema } from "./zod";

export async function create(prev: any, formData: FormData) {
  const zod = await zodVerify(createSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: "You must be logged in" };
  }
  if (!zod.success) {
    return zod;
  }

  const dbCreate = await prisma.project.create({
    data: {
      ...zod.data,
      user: {
        connect: {
          id: user.id,
        },
      },
    }
  });
  return { success: true, id: dbCreate.id };
}

export async function editProject(prev: any, formData: FormData) {
  const zod = await zodVerify(projectSettingsSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: "You must be logged in" };
  }
  if (!zod.success) {
    return zod;
  }

  const dbUpdate = await prisma.project.update({
    where: {
      id: zod.data.id,
    },
    data: {
      ...zod.data,
    }
  });
  return { success: true, id: dbUpdate.id };
}

export async function ratelimitChange(prev: any, formData: FormData) {
  // @ts-ignore transforming string to number makes the types go crazy
  const zod = await zodVerify(ratelimitChangeSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: "You must be logged in" };
  }
  if (!zod.success) {
    return zod;
  }

  const dbUpdate = await prisma.project.update({
    where: {
      id: zod.data.id,
    },
    data: {
      rateLimitReq: zod.data.requests,
      rateLimitTime: zod.data.duration,
    }
  });
  return { success: true, id: dbUpdate.id };
}

export async function customData(prev: any, formData: FormData) {
  const zod = await zodVerify(customDataSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: "You must be logged in" };
  }
  if (!zod.success) {
    return zod;
  }

  // separate by comma, remove whitespace
  const splitted = zod.data.data.split(',').map((s: string) => s.trim());

  const dbUpdate = await prisma.project.update({
    where: {
      id: zod.data.id,
    },
    data: {
      customData: splitted,
    }
  });
  return { success: true, id: dbUpdate.id };
}
