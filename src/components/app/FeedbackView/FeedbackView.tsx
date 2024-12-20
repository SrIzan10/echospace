import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Feedback } from '@prisma/client';
import { Eye } from 'lucide-react';

export default function FeedbackView(props: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'}>
          <Eye className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback id {props.feedback.id}</DialogTitle>
        </DialogHeader>
        <p>Message: {props.feedback.message}</p>
        {Object.entries(JSON.parse(props.feedback.customData)).map(([key, value]) => (
          <p key={key}>
            {key}: {value as string}
          </p>
        ))}
      </DialogContent>
    </Dialog>
  );
}

interface Props {
  feedback: Feedback;
}
