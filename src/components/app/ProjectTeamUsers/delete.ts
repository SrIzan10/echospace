'use server';

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export async function deleteProjectTeamUser(userId: string, projectId: string) {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  const userProject = await prisma.userProject.findFirst({
    where: { userId, projectId },
    include: { user: true },
  });
  if (!userProject) {
    return { success: false, message: 'User not found' };
  }

  await prisma.userProject.deleteMany({
    where: { userId, projectId },
  });
  return { success: true, message: `User ${userProject.user.username} removed.` };
}