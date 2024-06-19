/*
  Warnings:

  - A unique constraint covering the columns `[clerkID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_clerkID_key" ON "User"("clerkID");
