import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const isValid = await validateRequest(request);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = request.headers.get('x-github-event');
    // returns a string if valid, false if not, so we can parse it.
    const payload = JSON.parse(isValid);

    // handle installation events
    if (event === 'installation') {
      switch (payload.action) {
        case 'created':
          console.log('New installation:', payload.installation.id);
          await updateInstallation(payload.sender.id, payload.installation.id);
          break;
        case 'deleted':
          console.log('Installation deleted:', payload.installation.id);
          await updateInstallation(payload.sender.id, payload.installation.id, false);
          break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function updateInstallation(userId: number, installationId: number, isAdding = true) {
  const checkUserExists = await prisma.user.findUnique({
    where: {
      githubId: userId.toString(),
    },
  });
  if (!checkUserExists) return;

  if (isAdding) {
    await prisma.user.update({
      where: {
        githubId: userId.toString(),
      },
      data: {
        installations: {
          push: installationId.toString(),
        },
      },
    });
  } else {
    await prisma.user.update({
      where: {
        githubId: userId.toString(),
      },
      data: {
        installations: {
          // taking advantage of the prior user request to filter
          set: checkUserExists.installations.filter((id) => id !== installationId.toString()),
        },
      },
    });
  }
}

async function validateRequest(request: Request) {
  const headers = request.headers;
  const signature = headers.get('x-hub-signature-256');
  const body = await request.text();

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(body).digest('hex');
  if (
    !crypto.timingSafeEqual(
      new Uint8Array(Buffer.from(signature!)),
      new Uint8Array(Buffer.from(digest))
    )
  ) {
    return false;
  }

  return body;
}
