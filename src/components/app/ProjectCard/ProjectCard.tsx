import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@prisma/client';
import { Eye, Github } from 'lucide-react';
import Link from 'next/link';

export default function ProjectCard(props: Project) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.name}</CardTitle>
      </CardHeader>
      <CardContent>{props.description}</CardContent>
      <CardFooter className="flex justify-end gap-5">
        <Link href={`/project/${props.id}`}>
          <Button size={'icon'}>
            <Eye />
          </Button>
        </Link>
        {props.github && (
          <Link href={props.github}>
            <Button size={'icon'}>
              <Github />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="flex justify-end gap-5">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </CardFooter>
    </Card>
  );
}
