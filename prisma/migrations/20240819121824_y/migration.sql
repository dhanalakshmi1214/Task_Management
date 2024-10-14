/*
  Warnings:

  - Added the required column `taskId` to the `TaskAssigned` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskAssigned" ADD COLUMN     "taskId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TaskAssigned" ADD CONSTRAINT "TaskAssigned_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;
