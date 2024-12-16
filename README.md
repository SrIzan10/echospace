# Echospace

Echospace is a developer-centric user feedback platform that makes collecting and managing user feedback simple and streamlined.

## Features

- **Project Management**: Create and manage multiple feedback collection projects
- **Custom Data Fields**: Define custom data fields to collect alongside feedback
- **API Integration**: Simple REST API for collecting feedback
- **Rate Limiting**: Configurable rate limits per project
- **GitHub Integration**: Link projects to GitHub repositories

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Lucia with GitHub OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Docker with automated builds

## Getting Started
Selfhosting is not recommended (you can use the free hosted version), but you can do so! A docker image is available at `srizan10/echospace`.

1. Clone the repository
2. Set up environment variables:
```env
DATABASE_URL=postgresql://...
GITHUB_CLIENT=your_github_client_id
GITHUB_SECRET=your_github_secret
```