'use server';

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function join(code: string) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, message: "Unauthorized" };
  }
  const numCode = parseInt(code);
  if (isNaN(numCode) || code.length !== 8) {
    return { success: false, message: "Invalid code" };
  }

  const project = await prisma.project.findFirst({
    where: { inviteCode: code },
    include: {
      UserProject: {
        where: { userId: user.id },
      }
    }
  });
  if (!project) {
    return { success: false, message: "Project not found" };
  }
  if (project.UserProject.length > 0) {
    return { success: false, message: "Already joined project" };
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { UserProject: { create: { userId: user.id } } },
  });
  return { success: true, message: "Joined project", id: project.id };
}