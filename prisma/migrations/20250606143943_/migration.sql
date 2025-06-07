/*
  Warnings:

  - The values [RED,GREEN,BLUE,PINK,YELLOW,WHITE,GRAY] on the enum `Color` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Color_new" AS ENUM ('red', 'green', 'blue', 'pink', 'yellow', 'white', 'gray');
ALTER TABLE "notes" ALTER COLUMN "color" DROP DEFAULT;
ALTER TABLE "notes" ALTER COLUMN "color" TYPE "Color_new" USING ("color"::text::"Color_new");
ALTER TYPE "Color" RENAME TO "Color_old";
ALTER TYPE "Color_new" RENAME TO "Color";
DROP TYPE "Color_old";
ALTER TABLE "notes" ALTER COLUMN "color" SET DEFAULT 'white';
COMMIT;

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "color" SET DEFAULT 'white';
