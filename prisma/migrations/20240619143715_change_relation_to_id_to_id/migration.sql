/*
  Warnings:

  - The primary key for the `UserOnMovies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `movieId` on the `UserOnMovies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UserOnMovies" DROP CONSTRAINT "UserOnMovies_movieId_fkey";

-- AlterTable
ALTER TABLE "UserOnMovies" DROP CONSTRAINT "UserOnMovies_pkey",
DROP COLUMN "movieId",
ADD COLUMN     "movieId" INTEGER NOT NULL,
ADD CONSTRAINT "UserOnMovies_pkey" PRIMARY KEY ("movieId", "userId");

-- AddForeignKey
ALTER TABLE "UserOnMovies" ADD CONSTRAINT "UserOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
