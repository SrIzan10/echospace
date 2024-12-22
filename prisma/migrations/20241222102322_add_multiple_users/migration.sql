-- thanks ai

-- Step 1: Create the new UserProject table
CREATE TABLE "UserProject" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("userId","projectId")
);

-- Step 2: Insert existing userId and projectId pairs into the UserProject table
INSERT INTO "UserProject" ("userId", "projectId")
SELECT "userId", "id" FROM "Project" WHERE "userId" IS NOT NULL;

-- Step 3: Drop the foreign key constraint and the userId column from the Project table
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";
ALTER TABLE "Project" DROP COLUMN "userId";

-- Step 4: Add foreign key constraints to the UserProject table
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserProject" ADD CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 5: Drop the unnecessary _UserProjects table and its constraints
DROP TABLE IF EXISTS "_UserProjects";