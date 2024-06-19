-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");
