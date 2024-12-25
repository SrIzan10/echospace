'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/igzEEdGqAvH
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/lib/auth/actions';
import { useSession } from '@/lib/providers/SessionProvider';
import Link from 'next/link';
import { useActionState } from 'react';
import MobileNavbarLinks from '../MobileNavbarLinks/MobileNavbarLinks';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';

export const links = [
  { href: '/dashboard', name: 'Dashboard' },
  { href: 'https://github.com/sponsors/SrIzan10', name: '❤️ Donate' },
];

function NavbarLinks() {
  return (
    <div className="flex gap-8">
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Button variant={'link'}>{link.name}</Button>
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { user } = useSession();
  const [, logoutAction] = useActionState(logout, null);
  return (
    <>
      <nav className="flex items-center justify-between h-16 px-4 md:shadow border-b md:border-0 md:rounded-md md:mt-2 gap-3 shrink-0 max-w-6xl mx-auto bg-mantle">
        {/* Left section */}
        <div className="flex items-center">
          <Link href="/" className="hidden md:flex">
            <Button>echospace</Button>
          </Link>
          <MobileNavbarLinks />
        </div>

        {/* Center section */}
        <div className="hidden md:flex items-center justify-center">
          <NavbarLinks />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src={`https://github.com/${user.username}.png`}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      logoutAction();
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button variant="outline">Sign in</Button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
