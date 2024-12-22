-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "inviteCode" SET DEFAULT floor(random() * 90000000 + 10000000)::text;

-- AlterTable
ALTER TABLE "UserProject" ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT false;
