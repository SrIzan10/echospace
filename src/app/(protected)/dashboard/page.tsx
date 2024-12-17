import ProjectCard from '@/components/app/ProjectCard/ProjectCard';
import { Button } from '@/components/ui/button';
import { validateRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import Link from 'next/link';

export default async function Page() {
  const { user } = await validateRequest();
  const db = await prisma.project.findMany({
    where: {
      userId: user!.id,
    },
  });
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {db.length === 0 && (
        <div className="col-span-full text-center">
          <h1 className="text-2xl font-bold">No projects found</h1>
          <p className="text-muted-foreground">Create a project to get started</p>
          <Link href="/create">
            <Button size={'sm'}>Create Project</Button>
          </Link>
        </div>
      )}
      {db.map((d) => (
        <ProjectCard key={d.id} {...d} />
      ))}
    </div>
  );
}
