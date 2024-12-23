'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { User, UserProject } from '@prisma/client';
import { useSession } from '@/lib/providers/SessionProvider';
import { deleteProjectTeamUser } from './delete';
import { toast } from 'sonner';

export default function ProjectTeamUsers(userProject: ProjectTeamUsersProps) {
  const [users, setUsers] = useState<
    (UserProject & {
      user: User;
    })[]
  >(userProject.UserProject);
  const [loading, isLoading] = useState<string[]>([]);
  const { user: currentUser } = useSession();

  const handleDelete = (userId: string) => {
    isLoading([...loading, userId]);
    deleteProjectTeamUser(userId, userProject.UserProject[0].projectId).then((res) => {
      if (res.success) {
        toast.success(res.message);
        setUsers(users.filter((user) => user.userId !== userId));
      } else {
        toast.error(res.message);
      }
      isLoading(loading.filter((id) => id !== userId));
    });
  };

  // toReversed shows the owner at the top, then at join order
  return (
    <ul className="space-y-2 pt-5">
      {users.toReversed().map((user) => (
        <li
          key={user.userId}
          className="flex items-center justify-between p-3 rounded-lg shadow bg-accent"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={`https://github.com/${user.user.username}.png`}
                alt={user.user.username}
              />
              <AvatarFallback>{user.user.username.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.user.username}{user.isOwner && ' (owner)'}</span>
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDelete(user.userId)}
            aria-label={`Delete ${user.user.username}`}
            disabled={user.isOwner || user.userId === currentUser?.id}
            loading={loading.includes(user.userId)}
          >
            {!loading.includes(user.userId) && <Trash2 className="h-4 w-4" />}
          </Button>
        </li>
      ))}
    </ul>
  );
}

interface ProjectTeamUsersProps {
  UserProject: (UserProject & {
    user: User;
  })[];
}
