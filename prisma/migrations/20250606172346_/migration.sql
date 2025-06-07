/*
  Warnings:

  - You are about to drop the column `color` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "color",
DROP COLUMN "order";
