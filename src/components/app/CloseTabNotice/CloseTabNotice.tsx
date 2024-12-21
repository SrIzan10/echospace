'use client';

import { useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CloseTabNotice() {
  const searchParams = useSearchParams();
  const close = searchParams.has('close');
  if (!close) return null;

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You are back!</DialogTitle>
          <DialogDescription>
            Now that the github integration is installed, you can close this tab and refresh the
            other tab to see the repos! (or maybe not, in case of an organization it may need
            approval)
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
