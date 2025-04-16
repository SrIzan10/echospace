import { Plus, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function DottedCreateCard() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-xs border-dashed">
      <Link href="/create">
        <div className="flex items-center justify-center h-[50%] w-full">
          <Plus className='w-4 h-4 mr-2' />
          <p className="text-muted-foreground">Create</p>
        </div>
      </Link>
      <div className="rounded-lg border-t bg-card text-card-foreground shadow-xs border-dashed" />
      <Link href="/join">
        <div className="flex items-center justify-center h-[50%] w-full">
          <UserPlus className='w-4 h-4 mr-2' />
          <p className="text-muted-foreground">Join</p>
        </div>
      </Link>
    </div>
  );
}
