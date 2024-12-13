"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex items-center p-4 lg:p-8">
      <div className="w-full max-w-md m-auto">
        <Link href="/auth/github">
          <Button className="w-full">Log In with GitHub</Button>
        </Link>
      </div>
    </div>
  );
}
