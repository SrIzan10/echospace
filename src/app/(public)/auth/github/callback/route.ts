import { github, lucia } from '@/lib/auth';
import { cookies } from 'next/headers';
import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize } from 'lucia';
import prisma from '@/lib/db';
import { Octokit } from '@octokit/core';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const setupAction = url.searchParams.get('setup_action');
  if (setupAction === 'install') {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/?close',
      },
    });
  }
  const storedState = (await cookies()).get('github_oauth_state')?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const octokit = new Octokit({
      auth: tokens.accessToken(),
    });

    const { data: githubUser } = await octokit.request('GET /user');

    const existingUser = await prisma.user.findUnique({
      where: {
        githubId: githubUser.id.toString(),
      },
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    }

    const userId = generateIdFromEntropySize(10);

    await prisma.user.create({
      data: {
        id: userId,
        githubId: githubUser.id.toString(),
        username: githubUser.login,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    console.error(e);
    if (e instanceof OAuth2RequestError) {
      // invalid code
      console.error(e);
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: number;
  login: string;
}
