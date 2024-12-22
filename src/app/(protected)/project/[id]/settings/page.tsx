import ProjectSettings from "@/components/app/ProjectSettings/ProjectSettings";
import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await validateRequest();
  const project = await prisma.project.findFirst({
    where: { id, UserProject: { some: { userId: user!.id } } },
    include: {
      UserProject: {
        where: { projectId: id },
        include: { user: true },
      },
    },
  });
  if (!project) {
    return <h1>Project not found</h1>;
  }
  return <ProjectSettings {...project} />;
}