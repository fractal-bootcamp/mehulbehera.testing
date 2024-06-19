/*
  Warnings:

  - You are about to drop the `UserOnMovies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserOnMovies" DROP CONSTRAINT "UserOnMovies_movieId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnMovies" DROP CONSTRAINT "UserOnMovies_userId_fkey";

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerkID" TEXT;

-- DropTable
DROP TABLE "UserOnMovies";

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
