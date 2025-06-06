/*
  Warnings:

  - The required column `uuid` was added to the `Message` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `conversations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `notes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "uuid" TEXT NOT NULL;
