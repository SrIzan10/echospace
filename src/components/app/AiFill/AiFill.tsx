'use client';

import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';
import fill from './fill';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function AiFill(props: Props) {
  const [loading, setLoading] = useState(false);
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0}>
            <Button
              variant={'secondary'}
              onClick={() => {
                setLoading(true);
                fill(props.message).then((res) => {
                  setLoading(false);
                  if (res.success) {
                    props.onRespond(res.title!, res.message!);
                  } else {
                    toast.error(res.error);
                  }
                });
              }}
              loading={loading}
            >
              {!loading && <Wand2 className="w-4 h-4 mr-2" />}
              Fill with AI
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Always verify provided information!</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface Props {
  message: string;
  onRespond: (title: string, message: string) => void;
}
