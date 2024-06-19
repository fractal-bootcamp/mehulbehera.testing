import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

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

//create or update user
app.post("/createUser", async (req, res) => {
  const clerkIdentifier = req.body.id;
  const userName = req.body.name;
  console.log(clerkIdentifier);

  const user = await prisma.user.upsert({
    where: { clerkID: clerkIdentifier },
    update: { clerkID: clerkIdentifier, name: userName },
    create: { clerkID: clerkIdentifier, name: userName },
  });

  res.json(user);
});

//get list of all movies
app.get("/findAllMovies", async (req, res) => {
  const movies = await prisma.movie.findMany();
  res.json(movies);
});

app.get("/getUserMovies/:id", async (req, res) => {
  const clerkIdentifier = req.params.id;
  const user = await prisma.user.findUnique({
    where: {
      clerkID: clerkIdentifier,
    },
  });

  console.log("user", user?.id);

  const favMovies = await prisma.movie.findMany({
    where: {
      userId: user?.id,
    },
  });

  console.log("movies , ", favMovies);

  res.json(favMovies);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
