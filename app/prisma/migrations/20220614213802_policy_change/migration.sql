/*
  Warnings:

  - The primary key for the `Policy` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Policy` table. All the data in the column will be lost.
  - You are about to drop the column `policyScript` on the `Policy` table. All the data in the column will be lost.
  - Added the required column `name` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Made the column `policyId` on table `Policy` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_policyId_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationToPolicy" DROP CONSTRAINT "_OrganizationToPolicy_B_fkey";

-- AlterTable
ALTER TABLE "Policy" DROP CONSTRAINT "Policy_pkey",
DROP COLUMN "id",
DROP COLUMN "policyScript",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "script" JSONB,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "policyId" SET NOT NULL,
ADD CONSTRAINT "Policy_pkey" PRIMARY KEY ("policyId");

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "policyId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_OrganizationToPolicy" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("policyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToPolicy" ADD CONSTRAINT "_OrganizationToPolicy_B_fkey" FOREIGN KEY ("B") REFERENCES "Policy"("policyId") ON DELETE CASCADE ON UPDATE CASCADE;
