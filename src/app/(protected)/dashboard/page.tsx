import ProjectCard from '@/components/app/ProjectCard/ProjectCard';
import { Button } from '@/components/ui/button';
import { validateRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import Link from 'next/link';

export default async function Page() {
  const { user } = await validateRequest();
  const db = await prisma.project.findMany({
    where: {
      UserProject: {
        some: {
          userId: user!.id,
        },
      },
    },
  });
  if (db.length === 0) {
    return (
      <div className="text-center flex flex-col gap-4 pt-4">
        <h2>No projects found</h2>
        <p className="text-muted-foreground">Create a project to get started</p>
        <div className="flex justify-center gap-5">
          <Link href="/create">
            <Button size={'sm'}>Create</Button>
          </Link>
          <Link href="/join">
            <Button size={'sm'} variant={'secondary'}>
              Join
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {db.map((d) => (
        <ProjectCard key={d.id} {...d} />
      ))}
    </div>
  );
}
