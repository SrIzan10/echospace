-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "githubInstallationId" TEXT,
ALTER COLUMN "inviteCode" SET DEFAULT floor(random() * 90000000 + 10000000)::text;
