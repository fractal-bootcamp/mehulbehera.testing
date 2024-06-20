import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
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

  const userFavMovies = await prisma.userOnMovies.findMany({
    where: {
      user: user,
    },
  });
  console.log(userFavMovies);

  let favMovies = [];

  async function initialize() {
    for (let i = 0; i < userFavMovies.length; i++) {
      const movieID = userFavMovies[i].movieId;
      const movieToAdd = await prisma.movie.findUnique({
        where: {
          id: movieID,
        },
      });
      //@ts-ignore
      //favMovies.push(movieToAdd);
      favMovies = [...favMovies, movieToAdd];
    }
    console.log(favMovies);
    res.json(favMovies);
  }
  initialize();
});

app.post("/addFavorite", async (req, res) => {
  const clerkIdentifier = req.body.id;
  const movie = req.body.movie;

  const u = await prisma.user.findUnique({
    where: {
      clerkID: clerkIdentifier,
    },
  });

  const favoriteMovie = await prisma.userOnMovies.create({
    data: {
      userId: u!.id,
      movieId: movie!.id,
    },
  });

  res.json(favoriteMovie);
});

app.post("/addATag", async (req, res) => {
  const tag = req.body.tag;
  const movieName = req.body.movieName;

  const currentMovie = await prisma.movie.findUnique({
    where: {
      name: movieName,
    },
  });

  const currentTags = currentMovie?.tags;
  const newTags = [...currentTags!, tag];
  console.log(newTags);

  const movie = await prisma.movie.update({
    where: {
      name: movieName,
    },
    data: {
      tags: newTags,
    },
  });

  res.json(movie);
});

app.post("/deleteTag", async (req, res) => {
  const tag = req.body.tag;
  const movieName = req.body.movieName;

  const currentMovie = await prisma.movie.findUnique({
    where: {
      name: movieName,
    },
  });

  const currentTags = currentMovie?.tags;
  const newTags: string[] = [];

  for (let i = 0; i < currentTags!.length; i++) {
    if (currentTags![i] !== tag) {
      newTags.push(currentTags![i]);
    }
  }

  console.log(newTags);

  const movie = await prisma.movie.update({
    where: {
      name: movieName,
    },
    data: {
      tags: newTags,
    },
  });

  res.json(movie);
});

app.post("/removeFavorite", async (req, res) => {
  const clerkIdentifier = req.body.id;
  const movie = req.body.movie;

  const user = await prisma.user.findUnique({
    where: {
      clerkID: clerkIdentifier,
    },
  });

  const userMovie = await prisma.userOnMovies.deleteMany({
    where: {
      user: user,
      movieId: movie.id,
    },
  });

  console.log("to Delete: ", userMovie);

  res.json(userMovie);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
