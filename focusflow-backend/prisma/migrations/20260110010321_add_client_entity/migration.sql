/*
  Warnings:

  - You are about to drop the column `clientCompany` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `clientContactEmail` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `clientContactName` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `clientContactPhone` on the `Project` table. All the data in the column will be lost.
  - Made the column `ownerId` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "clientCompany",
DROP COLUMN "clientContactEmail",
DROP COLUMN "clientContactName",
DROP COLUMN "clientContactPhone",
ADD COLUMN     "clientId" TEXT,
ALTER COLUMN "ownerId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "notes" TEXT,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Client_ownerId_idx" ON "Client"("ownerId");

-- CreateIndex
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
