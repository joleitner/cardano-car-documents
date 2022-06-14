-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "policyId" TEXT,
ADD COLUMN     "policyScript" JSONB;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "policyId" INTEGER;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
