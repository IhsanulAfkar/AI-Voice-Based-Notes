/*
  Warnings:

  - You are about to drop the column `note_id` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_note_id_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "note_id";
