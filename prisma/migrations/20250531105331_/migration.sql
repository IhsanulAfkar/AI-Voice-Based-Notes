/*
  Warnings:

  - Added the required column `user_id` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
