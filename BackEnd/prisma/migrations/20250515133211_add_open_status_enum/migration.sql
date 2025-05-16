-- AlterEnum
ALTER TYPE "TodoStatus" ADD VALUE 'OPEN';

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile_pict" TEXT;
