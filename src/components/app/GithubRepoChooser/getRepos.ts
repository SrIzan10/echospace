'use server';

import { validateRequest } from '@/lib/auth';
import { octokitApp } from '@/lib/octokitApp';

export async function getRepos() {
  const { user } = await validateRequest();
  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const repoList: Array<{ name: string; pushed_at: string; installationId: string }> = [];

  for (const installation of user.installations) {
    const octokit = await octokitApp.getInstallationOctokit(Number(installation));
    const { data: repos } = await octokit.request('GET /installation/repositories', {
      per_page: 100,
    });
    if (repos.repositories.length >= 100) {
      await octokit
        .request('GET /installation/repositories', {
          per_page: 100,
          page: 2,
        })
        .then(({ data }) => repos.repositories.push(...data.repositories));
    }

    const repoData = repos.repositories.map((repo) => ({
      name: repo.full_name,
      pushed_at: repo.pushed_at ?? '1970-01-01T00:00:00Z',
      installationId: installation,
    }));

    repoList.push(...repoData);
  }

  const sortedRepos = repoList
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .map((repo) => {
      return { name: repo.name, installationId: repo.installationId };
    });

  return { success: true, repos: sortedRepos };
}
