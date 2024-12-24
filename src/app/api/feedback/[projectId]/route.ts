import prisma from '@/lib/db';
import redis from '@/lib/db/redis';
import ratelimit from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const body = await request.json();

  const ratelimitInfo = await redis.get(`ratelimit:${projectId}`);
  if (!ratelimitInfo) {
    return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
  }

  const [rateLimitReq, rateLimitTime] = ratelimitInfo.split(':').map(Number);
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip');
  const queryRL = await ratelimit(
    ip!,
    projectId,
    rateLimitReq,
    rateLimitTime
  );
  if (queryRL.exceeded) {
    return Response.json(
      {
        success: false,
        error: `Rate limit exceeded. Try again in ${queryRL.reset} seconds.`,
      },
      { status: 429, headers: { 'Retry-After': queryRL.reset.toString() } }
    );
  }

  const queryProject = await prisma.project.findFirst({
    where: {
      id: projectId,
    },
  });
  if (!queryProject) {
    return Response.json({ success: false, error: 'Project not found' }, { status: 404 });
  }

  // Convert customKeys to regular array and add message
  const customKeys = [...queryProject.customData, 'message'];
  const bodyKeys = Object.keys(body);

  // Find missing required keys (keys that should be in body but aren't)
  const keysLeft = customKeys.filter((key) => !bodyKeys.includes(key));

  // Find invalid keys (keys in body that aren't allowed)
  const invalidKeys = bodyKeys.filter((key) => !customKeys.includes(key));

  if (keysLeft.length || invalidKeys.length) {
    return Response.json(
      {
        success: false,
        error: `Invalid keys: ${invalidKeys.join(', ')}, keys left: ${keysLeft.join(', ')}`,
      },
      { status: 400 }
    );
  }
  // check if all values of the keys are strings. this will prevent
  // any type of injection or unexpected behavior.
  const invalidValues = Object.entries(body).filter(([key, value]) => typeof value !== 'string');
  if (invalidValues.length) {
    return Response.json(
      {
        success: false,
        error: `Invalid values for keys: ${invalidValues
          .map(([key]) => key)
          .join(', ')}. Make sure it is a string.`,
      },
      { status: 400 }
    );
  }

  const noMessageBody = Object.fromEntries(
    Object.entries(body).filter(([key]) => key !== 'message')
  );
  await prisma.feedback.create({
    data: {
      message: body.message,
      customData: JSON.stringify(noMessageBody),
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });

  return Response.json({ success: true });
}
