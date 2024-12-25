import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { validateRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Eye, Github } from 'lucide-react';
import FeedbackView from '@/components/app/FeedbackView/FeedbackView';
import GithubIssueCreate from '@/components/app/GithubIssueCreate/GithubIssueCreate';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await validateRequest();
  const project = await prisma.project.findFirst({
    where: { id, UserProject: { some: { userId: user!.id } } },
    include: { feedback: true },
  });

  if (!project) {
    return (
      <>
        <h2>Project not found</h2>
        <p>...or maybe you don&apos;t have permission!</p>
      </>
    );
  }

  // maybe it's not clean enough but who cares
  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb className="pb-5">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between w-full pb-10">
          <h2>{project.name}</h2>
          <p className="text-muted-foreground ml-2 truncate">{project.description}</p>
          <Link href={`/project/${id}/settings`}>
            <Button>Settings</Button>
          </Link>
        </div>
        <div className="border rounded-lg max-h-[32rem] overflow-y-auto">
          {project.feedback.length === 0 && (
            <div className="flex flex-col justify-center items-center p-10">
              <h2>No feedback!</h2>
              <p className="text-muted-foreground mt-2">
                Once you start receiving feedback, it will appear here.
              </p>
            </div>
          )}
          <Table>
            {project.feedback.length > 0 && (
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead>Message</TableHead>
                  {project.customData.map((key) => (
                    <TableHead key={key}>{key}</TableHead>
                  ))}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {/*
                using toReversed to not change the upstream array in case of
                other data treatments needed.
                why js why
              */}
              {project.feedback.toReversed().map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>{feedback.id}</TableCell>
                  <TableCell>{feedback.message}</TableCell>
                  {Object.entries(JSON.parse(feedback.customData)).map(([key, value]) => (
                    <TableCell key={key}>{value as string}</TableCell>
                  ))}
                  <TableCell className="flex gap-2">
                    <FeedbackView feedback={feedback} />
                    {project.github && <GithubIssueCreate project={project} feedback={feedback} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
