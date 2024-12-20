'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Feedback, Project } from '@prisma/client';
import { Github } from 'lucide-react';
import { UniversalForm } from '../UniversalForm/UniversalForm';
import { githubCreateIssue } from '@/lib/forms/actions';
import React from 'react';

export default function GithubIssueCreate(props: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'icon'}>
          <Github className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Github issue</DialogTitle>
        </DialogHeader>
        <UniversalForm
          fields={[
            {
              type: 'text',
              name: 'title',
              label: 'Title',
            },
            {
              type: 'text',
              name: 'message',
              textArea: true,
              label: 'Message',
              value: props.feedback.message,
            },
            {
              type: 'hidden',
              name: 'feedback',
              label: 'Feedback',
              value: props.feedback.id.toString(),
            },
            {
              type: 'hidden',
              name: 'project',
              label: 'Project',
              value: props.project.id.toString(),
            },
          ]}
          submitText={'Create issue'}
          submitClassname="float-right !mt-5"
          schemaName={'githubIssueCreate'}
          action={githubCreateIssue}
          onActionComplete={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

interface Props {
  project: Project;
  feedback: Feedback;
}
