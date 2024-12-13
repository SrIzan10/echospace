/*
  Warnings:

  - You are about to drop the column `hashed_password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[githubId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashed_password",
ADD COLUMN     "githubId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
