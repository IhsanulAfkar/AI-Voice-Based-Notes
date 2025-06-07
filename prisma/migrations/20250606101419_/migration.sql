/*
  Warnings:

  - The `color` column on the `notes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Color" AS ENUM ('RED', 'GREEN', 'BLUE', 'PINK', 'YELLOW', 'WHITE', 'GRAY');

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "color",
ADD COLUMN     "color" "Color" NOT NULL DEFAULT 'WHITE';
