"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/igzEEdGqAvH
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { logout } from "@/lib/auth/actions"
import { useSession } from "@/lib/providers/SessionProvider"
import Link from "next/link"
import { useActionState } from "react"
import MobileNavbarLinks from "../MobileNavbarLinks/MobileNavbarLinks"
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher"

export const links = [
  { href: '/dashboard', name: 'Dashboard' },
  { href: '/create', name: 'Create' },
  { href: '/join', name: 'Join' },
]

function NavbarLinks() {
  return (
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Button variant={'link'}>{link.name}</Button>
        </Link>
      ))}
    </>
  );
}

export default function Navbar() {
  const { user } = useSession();
  const [, logoutAction] = useActionState(logout, null)
  return (
    <>
      <nav className="flex items-center h-16 px-4 border-b gap-3 shrink-0">
        <Link href="/" className="hidden md:flex">
          <Button>echospace</Button>
        </Link>
        <MobileNavbarLinks />
        <div className="hidden md:flex">
          <NavbarLinks />
        </div>
        <div className="flex-1" />
        <ThemeSwitcher />
        {user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar>
                  <AvatarImage src={`https://github.com/${user.username}.png`} alt={user.username} />
                  <AvatarFallback>{user.username}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => {
                    logoutAction()
                  }}>
                    Sign out
                  </DropdownMenuItem>
                  </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href="/auth">
            <Button variant="outline">Sign in</Button>
          </Link>
        )}
      </nav>
    </>
  );
}