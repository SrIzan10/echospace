'use server';

import {
  customDataSchema,
  githubIssueCreateSchema,
  githubSettingsSchema,
  githubTestIssueSchema,
  projectSettingsSchema,
  ratelimitChangeSchema,
} from '@/components/app/UniversalForm/zod';
import { validateRequest } from '../auth';
import prisma from '../db';
import zodVerify from '../zodVerify';
import { createSchema } from './zod';
import { octokitApp } from '../octokitApp';

export async function create(prev: any, formData: FormData) {
  const zod = await zodVerify(createSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }
  if (!zod.success) {
    return zod;
  }

  const dbCreate = await prisma.project.create({
    data: {
      ...zod.data,
      UserProject: {
        create: {
          userId: user.id,
          isOwner: true,
        },
      },
    },
  });
  return { success: true, id: dbCreate.id };
}

export async function editProject(prev: any, formData: FormData) {
  const zod = await zodVerify(projectSettingsSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }
  if (!zod.success) {
    return zod;
  }

  const dbUpdate = await prisma.project.update({
    where: {
      id: zod.data.id,
    },
    data: {
      ...zod.data,
    },
  });
  return { success: true, id: dbUpdate.id };
}

export async function ratelimitChange(prev: any, formData: FormData) {
  // @ts-ignore transforming string to number makes the types go crazy
  const zod = await zodVerify(ratelimitChangeSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }
  if (!zod.success) {
    return zod;
  }

  const dbUpdate = await prisma.project.update({
    where: {
      id: zod.data.id,
    },
    data: {
      rateLimitReq: zod.data.requests,
      rateLimitTime: zod.data.duration,
    },
  });
  return { success: true, id: dbUpdate.id };
}

export async function customData(prev: any, formData: FormData) {
  const zod = await zodVerify(customDataSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }
  if (!zod.success) {
    return zod;
  }

  // separate by comma, remove whitespace
  const splitted = zod.data.data.split(',').map((s: string) => s.trim());

  const dbUpdate = await prisma.project.update({
    where: {
      id: zod.data.id,
    },
    data: {
      customData: splitted,
    },
  });
  return { success: true, id: dbUpdate.id };
}

export async function githubSettings(prev: any, formData: FormData) {
  // @ts-ignore transforming string to number makes the types go crazy
  const zod = await zodVerify(githubSettingsSchema, formData);
  const { user, session } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }
  if (!zod.success) {
    return zod;
  }

  const dbUpdate = await prisma.project.update({
    where: {
      id: zod.data.id,
    },
    data: {
      github: zod.data.github,
      githubInstallationId: zod.data.installationId.toString(),
    },
  });
  return { success: true, id: dbUpdate.id };
}

export async function githubTestIssue(prev: any, formData: FormData) {
  const zod = await zodVerify(githubTestIssueSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }
  if (!zod.success) {
    return zod;
  }

  const project = await prisma.project.findUnique({
    where: {
      id: zod.data.id,
    },
    include: {
      UserProject: {
        where: {
          userId: user.id,
        },
        include: {
          user: true,
        },
      },
    },
  });
  if (!project) {
    return { success: false, error: 'Project not found' };
  }
  if (!project.github || !project.githubInstallationId) {
    return { success: false, error: 'Github settings not found' };
  }

  try {
    const [owner, repo] = project.github!.split('/').slice(-2);
    const installation = await octokitApp.getInstallationOctokit(
      parseInt(project.githubInstallationId!)
    );
    const getRepo = await installation
      .request('GET /repos/{owner}/{repo}', {
        owner,
        repo,
      })
      .catch(() => ({ status: 404 }));
    if (getRepo.status === 200) {
      await installation.request('POST /repos/{owner}/{repo}/issues', {
        owner,
        repo,
        title: 'Test issue',
        body: "### You are all set! 🎉\n\nIf you're reading this, the test issue has been created successfully!",
      });
    }
  } catch (e) {
    console.error(e);
    return { success: false, error: e };
  }

  return { success: true };
}

export async function githubCreateIssue(prev: any, formData: FormData) {
  const zod = await zodVerify(githubIssueCreateSchema, formData);
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }
  if (!zod.success) {
    return zod;
  }

  const project = await prisma.project.findUnique({
    where: {
      id: zod.data.project,
    },
    include: {
      UserProject: {
        where: {
          userId: user.id,
        },
        include: {
          user: true,
        },
      },
    },
  });
  if (!project) {
    return { success: false, error: 'Project not found' };
  }

  try {
    const [owner, repo] = project.github!.split('/').slice(-2);
    const installation = await octokitApp.getInstallationOctokit(
      Number(project.githubInstallationId)
    );
    const getRepo = await installation
      .request('GET /repos/{owner}/{repo}', {
        owner,
        repo,
      })
      .catch(() => ({ status: 404 }));
    if (getRepo.status === 200) {
      await installation.request('POST /repos/{owner}/{repo}/issues', {
        owner,
        repo,
        title: zod.data.title,
        body: `### Feedback\n\nFeedback ID: ${zod.data.feedback}\n\n### Message\n\n${zod.data.message}`,
      });
    }
  } catch (e) {
    console.error(e);
    return { success: false, error: e };
  }

  return { success: true };
}
