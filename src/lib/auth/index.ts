import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { Lucia } from 'lucia';
import prisma from '../db';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { GitHub } from 'arctic';

export const github = new GitHub(
  process.env.GITHUB_CLIENT!,
  process.env.GITHUB_SECRET!,
  `${
    process.env.NODE_ENV === 'production' ? 'https://echospace.dev' : 'http://localhost:3000'
  }/auth/github/callback`
);
const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.githubId,
      username: attributes.username,
      installations: attributes.installations,
    };
  },
});
export const validateRequest = cache(async () => {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId)
    return {
      user: null,
      session: null,
    };

  const { user, session } = await lucia.validateSession(sessionId);
  try {
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch {
    // Next.js throws error attempting to set cookies when rendering page
  }
  return {
    user,
    session,
  };
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  githubId: string;
  username: string;
  installations: string[];
}
