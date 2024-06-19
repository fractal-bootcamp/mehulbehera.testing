-- CreateTable
CREATE TABLE "Movie" (
    "name" TEXT NOT NULL,
    "premierDate" TEXT,
    "ratingOutOfTen" INTEGER,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnMovies" (
    "movieId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserOnMovies_pkey" PRIMARY KEY ("movieId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Movie_name_key" ON "Movie"("name");

-- AddForeignKey
ALTER TABLE "UserOnMovies" ADD CONSTRAINT "UserOnMovies_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnMovies" ADD CONSTRAINT "UserOnMovies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
