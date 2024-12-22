'use client';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import React from 'react';
import { join } from './action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center pt-10 gap-5">
      <h2>Join another user&apos;s project!</h2>
      <InputOTP
        maxLength={8}
        pattern={REGEXP_ONLY_DIGITS}
        onChange={(val) => setValue(val)}
        value={value}
        disabled={loading}
      >
        <InputOTPGroup>
          {/* THIS DOESNT WORK: 
            {Array.from({ length: 8 }).map((_, i) => (
              <InputOTPSlot key={i + 1} index={i + 1} />
            ))}
            SO HERE'S BAD CODE YOU ARE WELCOME
          */}
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>
      <Button
        onClick={() => {
          setLoading(true);
          join(value).then((res) => {
            setLoading(false);
            if (res.success) {
              toast.success('Joined project!');
              router.push(`/project/${res.id}`);
            } else {
              toast.error(res.message);
            }
          });
        }}
        loading={loading}
      >
        Let&apos;s go!
      </Button>
    </div>
  );
}
