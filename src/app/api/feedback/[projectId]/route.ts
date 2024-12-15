import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: { projectId: string } }) {
  const { projectId } = params;
  const body = await request.json();
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
  console.log(bodyKeys);

  // Find missing required keys (keys that should be in body but aren't)
  const keysLeft = customKeys.filter((key) => !bodyKeys.includes(key));
  console.log(keysLeft);

  // Find invalid keys (keys in body that aren't allowed)
  const invalidKeys = bodyKeys.filter((key) => !customKeys.includes(key));
  console.log(invalidKeys);

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
