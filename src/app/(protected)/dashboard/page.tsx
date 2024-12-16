import ProjectCard from '@/components/app/ProjectCard/ProjectCard';
import { validateRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import { faker } from '@faker-js/faker';

export default async function Page() {
  const { user } = await validateRequest();
  const db = await prisma.project.findMany({
    where: {
      userId: user!.id,
    },
  });
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {db.map((d) => (
        <ProjectCard key={d.id} {...d} />
      ))}
    </div>
  );
}
