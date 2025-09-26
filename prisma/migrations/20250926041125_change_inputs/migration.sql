/*
  Warnings:

  - Made the column `paymentMethod` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "paymentMethod" SET NOT NULL,
ALTER COLUMN "paymentMethod" SET DEFAULT 'pix';

-- AlterTable
ALTER TABLE "public"."OrderItem" ALTER COLUMN "title" SET NOT NULL;
