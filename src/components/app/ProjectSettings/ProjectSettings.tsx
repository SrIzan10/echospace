'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Project, User, UserProject } from '@prisma/client';
import { UniversalForm } from '../UniversalForm/UniversalForm';
import {
  customData,
  editProject,
  githubSettings,
  githubTestIssue,
  ratelimitChange,
} from '@/lib/forms/actions';
import { bodyGen, bodyGenNoIdent } from '@/lib/bodyGen';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import GithubRepoChooser from '../GithubRepoChooser/GithubRepoChooser';
import React from 'react';
import Link from 'next/link';
import InviteCodeViewer from '../InviteCodeViewer/InviteCodeViewer';
import ProjectTeamUsers from '../ProjectTeamUsers/ProjectTeamUsers';

export default function ProjectSettings(project: ProjectWithUsers) {
  const [ghRepo, setGhRepo] = React.useState('');
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const apiUrl = `https://${window.location.hostname}/api/feedback/${project.id}`;
  React.useEffect(() => {
    setHasSubmitted(project.github !== '');
  }, [project.github]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Breadcrumb className="pb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/project/${project.id}`}>{project.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-6">
        <h1 className="pb-2">Project Settings</h1>
        <p className="text-muted-foreground">Manage your project configuration and preferences</p>
      </div>

      <Tabs defaultValue="project" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="github">Github</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="project">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Basic information about your project</CardDescription>
              </CardHeader>
              <CardContent>
                <UniversalForm
                  fields={[
                    {
                      name: 'name',
                      label: 'Project Name',
                      placeholder: 'My Awesome Project',
                      value: project.name,
                    },
                    {
                      name: 'description',
                      label: 'Description',
                      placeholder: 'A brief description of your project',
                      value: project.description,
                    },
                    {
                      name: 'id',
                      label: 'ID',
                      type: 'hidden',
                      value: project.id,
                    },
                  ]}
                  schemaName={'projectSettings'}
                  action={editProject}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custom Data</CardTitle>
                <CardDescription>Custom fields to store additional data</CardDescription>
              </CardHeader>
              <CardContent>
                <UniversalForm
                  fields={[
                    {
                      name: 'data',
                      label: 'Custom data',
                      value: project.customData.join(','),
                      description: 'Comma separated list of custom data',
                    },
                    {
                      name: 'id',
                      label: 'ID',
                      type: 'hidden',
                      value: project.id,
                    },
                  ]}
                  schemaName={'customData'}
                  action={customData}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your team</CardTitle>
                <CardDescription>Invite people to join the project!</CardDescription>
              </CardHeader>
              <CardContent>
                <InviteCodeViewer code={project.inviteCode} />
                <ProjectTeamUsers UserProject={project.UserProject} />
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader>
                <CardTitle>Project Deletion</CardTitle>
                <CardDescription>Permanently delete your project</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  This action is irreversible. All feedback and settings will be lost.
                </p>
                <UniversalForm
                  fields={[
                    {
                      name: 'id',
                      label: 'ID',
                      type: 'hidden',
                      value: project.id,
                    },
                  ]}
                  schemaName={'deleteProject'}
                  action={editProject}
                  submitText="Delete Project"
                  submitClassname="!mt-0"
                />
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>

        <TabsContent value="github" className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Github Integration</CardTitle>
              <CardDescription>Connect your project to Github</CardDescription>
            </CardHeader>
            <CardContent>
              <GithubRepoChooser
                onSelect={(repo) => {
                  setGhRepo(`https://github.com/${repo}`);
                }}
                selected={project.github ? project.github.replace('https://github.com/', '') : ''}
              />
              <p className="text-muted-foreground text-xs mt-2">
                Not the results you were expecting? You may have not allowed your user in the{' '}
                <Link
                  href="https://github.com/apps/echospacedev/installations/new"
                  target="_blank"
                  className="text-primary"
                >
                  installation settings
                </Link>
                .
              </p>
              <UniversalForm
                fields={[
                  {
                    name: 'github',
                    label: 'GitHub Repository',
                    type: 'hidden',
                    value: ghRepo,
                  },
                  {
                    name: 'id',
                    label: 'ID',
                    type: 'hidden',
                    value: project.id,
                  },
                ]}
                key={ghRepo}
                schemaName={'githubSettings'}
                action={githubSettings}
                onActionComplete={() => setHasSubmitted(true)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Issue submission testing</CardTitle>
              <CardDescription>Make sure your setup works!</CardDescription>
            </CardHeader>
            <CardContent>
              {hasSubmitted ? (
                <UniversalForm
                  fields={[
                    {
                      name: 'id',
                      label: 'ID',
                      type: 'hidden',
                      value: project.id,
                    },
                  ]}
                  schemaName={'githubTestIssue'}
                  action={githubTestIssue}
                  submitText="Create test issue"
                  submitClassname="!mt-0"
                />
              ) : (
                <p className="text-muted-foreground text-sm">
                  You need to connect your project to a GitHub repository before you can test issue
                  submission.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Making a Request</CardTitle>
              <CardDescription>Instructions on how to make an API request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Endpoint</h3>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {apiUrl}
                </code>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Method</h3>
                <p className="text-sm">POST</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Body</h3>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm block whitespace-pre">
                  {bodyGen(project.customData)}
                </code>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Example Request (cURL)</h3>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm block whitespace-pre overflow-x-auto">
                  {stripIndents`curl -X POST \\
          -d '${bodyGenNoIdent(project.customData)}' \\
          ${apiUrl}`}
                </code>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Rate limiting</CardTitle>
              <CardDescription>Manage your API rate limits.</CardDescription>
            </CardHeader>
            <CardContent>
              <UniversalForm
                fields={[
                  {
                    name: 'requests',
                    label: 'Requests',
                    placeholder: 'The amount of requests you want to limit',
                    value: project.rateLimitReq.toString(),
                    type: 'number',
                  },
                  {
                    name: 'duration',
                    label: 'Duration',
                    placeholder: 'In seconds',
                    value: project.rateLimitTime.toString(),
                    type: 'number',
                  },
                  {
                    name: 'id',
                    label: 'ID',
                    type: 'hidden',
                    value: project.id,
                  },
                ]}
                schemaName={'ratelimitChange'}
                action={ratelimitChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function stripIndents(strings: TemplateStringsArray, ...values: any[]) {
  const fullString = strings.reduce((accumulator, str, i) => {
    const value = values[i] ? values[i] : '';
    return accumulator + str + value;
  }, '');

  const lines = fullString.split('\n');

  // Find minimum indentation level (excluding empty lines)
  const minIndent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => {
      const indent = line.match(/^\s*/)![0].length;
      return indent < min ? indent : min;
    }, Infinity);

  // Apply minimum indent + 2 spaces to each line
  return lines
    .map((line) => line.trim())
    .map((line) => (line ? ' '.repeat(minIndent + 2) + line : line))
    .join('\n')
    .trim();
}

interface ProjectWithUsers extends Project {
  UserProject: (UserProject & {
    user: User;
  })[];
}