-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "mpPreferenceId" TEXT,
ALTER COLUMN "paymentMethod" DROP DEFAULT;
