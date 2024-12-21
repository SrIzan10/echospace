'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Feedback, Project } from '@prisma/client';
import { Github, Wand } from 'lucide-react';
import { UniversalForm } from '../UniversalForm/UniversalForm';
import { githubCreateIssue } from '@/lib/forms/actions';
import React from 'react';
import AiFill from '../AiFill/AiFill';

export default function GithubIssueCreate(props: Props) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState(props.feedback.message);

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
              value: title,
            },
            {
              type: 'text',
              name: 'message',
              textArea: true,
              textAreaRows: 8,
              label: 'Message',
              value: message,
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
          submitButtonDivClassname="float-right"
          schemaName={'githubIssueCreate'}
          action={githubCreateIssue}
          onActionComplete={() => setOpen(false)}
          otherSubmitButton={
            <AiFill
              message={props.feedback.message}
              onRespond={(title, message) => {
                setTitle(title);
                setMessage(message);
              }}
            />
          }
          key={`${title}-${message}`}
        />
      </DialogContent>
    </Dialog>
  );
}

interface Props {
  project: Project;
  feedback: Feedback;
}
