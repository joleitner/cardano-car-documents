/*
  Warnings:

  - You are about to drop the column `account` on the `Wallet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Wallet_account_key";

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "account",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_name_key" ON "Wallet"("name");
