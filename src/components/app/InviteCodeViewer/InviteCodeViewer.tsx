'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function InviteCodeViewer({ code }: { code: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Invite code</Label>
      <Input
        type="text"
        id="inviteCode"
        placeholder="Invite code"
        className={hover ? '' : 'blur-xs'}
        onChange={() => {}}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        value={code}
      />
    </div>
  );
}
