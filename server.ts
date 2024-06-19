import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const PORT = 3000;
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//get movie by id
app.get("/findMovie/:name", async (req, res) => {
  const movieName = req.params.name;

  const movie = await prisma.movie.findUnique({
    where: {
      name: movieName,
    },
  });
  console.log("movie: ", movie);
  res.json(movie);
});

// //creates a favorite relationship between a user and movie
// app.post("/createFav", async (req, res) => {
//   const { movieID, userID } = req.params;

//   const userFavMovie = await prisma.userOnMovies.create({
//     data: {
//       movieId: movieID,
//       userId: userID,
//     },
//   });

//   res.json(userFavMovie);
// });

//get list of all movies
app.get("/findAllMovies", async (req, res) => {
  const movies = await prisma.movie.findMany();
  res.json(movies);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
