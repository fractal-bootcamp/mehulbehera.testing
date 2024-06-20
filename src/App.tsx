import { useEffect, useState } from "react";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { Prisma } from "@prisma/client";

const serverPath = "http://localhost:3000";

//gets all movies from database
async function getAllMovies() {
  const response = await fetch(`${serverPath}/findAllMovies`);
  const json = await response.json();
  return json;
}

//get individual movie
async function getMovie(name: string) {
  const response = await fetch(`${serverPath}/findMovie/${name}`);
  const json = await response.json();
  return json;
}

async function createOrUpdateUser(id: string, name: string) {
  const response = await fetch(`${serverPath}/createUser`, {
    method: "POST",
    body: JSON.stringify({ id, name }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}

async function getUserFavMovies(clerkID: string) {
  const response = await fetch(`${serverPath}/getUserMovies/${clerkID}`);
  const json = await response.json();
  return json;
}

async function addFavoriteMovie(id: string, movie: Prisma.MovieCreateInput) {
  const response = await fetch(`${serverPath}/addFavorite`, {
    method: "POST",
    body: JSON.stringify({ id, movie }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}

async function removeFavoriteMovie(id: string, movie: Prisma.MovieCreateInput) {
  const response = await fetch(`${serverPath}/removeFavorite`, {
    method: "POST",
    body: JSON.stringify({ id, movie }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}

async function addATag(tag: string, movieName: string) {
  const response = await fetch(`${serverPath}/addATag`, {
    method: "POST",
    body: JSON.stringify({ tag, movieName }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}

async function deleteTag(tag: string, movieName: string) {
  const response = await fetch(`${serverPath}/deleteTag`, {
    method: "POST",
    body: JSON.stringify({ tag, movieName }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}

function App() {
  const [movielist, setMovies] = useState([]);
  const [searchText, setSearchBar] = useState("");
  const [movieFromSearch, setMovieSearch] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const [favMovieList, setFavMovies] = useState([]);
  const [nonFavList, setNonFav] = useState([]);
  const [tagText, setTagText] = useState("");
  const [tagMovieName, setTagMovieName] = useState("");
  const [poller, setPoller] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setPoller(poller + 1);
  //   }, 500);
  // }, [poller]);

  let count = 0;

  useEffect(() => {
    async function initialize() {
      const data = await getAllMovies();
      setMovies(data);
    }

    initialize();
    if (isSignedIn) {
      createOrUpdateUser(user!.id, user!.firstName);
      async function setupMovies() {
        const favMovies = await getUserFavMovies(user!.id);
        setFavMovies(favMovies);
      }
      setupMovies();
      getNonFavorites();
    }

    // console.log(movielist);
    // console.log(favMovieList);
    // console.log(nonFavList);
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      createOrUpdateUser(user!.id, user!.firstName);
      async function setupMovies() {
        const favMovies = await getUserFavMovies(user!.id);
        setFavMovies(favMovies);
      }
      setupMovies();
      getNonFavorites();
    }
  }, [isSignedIn]);

  function getNonFavorites() {
    const nonFavMovies = [];
    const movieListNames = movielist.map((movie) => movie?.name);
    const favMovieListNames = favMovieList.map((movie) => movie?.name);
    const nonFavMoviesNames = movieListNames.filter(
      (movieName) => !favMovieListNames?.includes(movieName)
    );

    for (let i = 0; i < movielist.length; i++) {
      if (nonFavMoviesNames.includes(movielist[i]?.name)) {
        nonFavMovies.push(movielist[i]);
      }
    }
    setNonFav(nonFavMovies);
  }

  //searches for movie when search is clicked
  async function searchMovie(movieToSearch: string) {
    const data = await getMovie(movieToSearch);
    setMovieSearch(data);

    if (data !== null) {
      document.getElementById("movie_modal")!.showModal();
    } else {
      document.getElementById("no_movie_modal")!.showModal();
    }
  }

  return (
    <>
      <header></header>
      <div className="navbar bg-base-100">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Movie Finder</a>
        </div>
        <SignedOut>
          <SignInButton>
            <button className="btn" onClick={() => {}}>
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      <div className="flex flex-row my-1 gap-1">
        <label className="input input-bordered flex flex-grow items-center gap-2">
          <input
            type="text"
            className="my-2 grow"
            placeholder="Search"
            onChange={(e) => setSearchBar(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <button className="btn" onClick={() => searchMovie(searchText)}>
          Search
        </button>
      </div>
      <SignedIn>
        <div className="text-xl my-4">Favorites</div>

        <div className="overflow-x-auto my-2">
          <table className="table table-xs">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Priemiere Date</th>
                <th>Tags</th>
                <th>Add Tag</th>
                <th>Favorite</th>
              </tr>
            </thead>
            <tbody>
              {favMovieList.map((movie) => (
                <tr>
                  <th>{(count += 1)}</th>
                  <td>{movie?.name}</td>
                  <td>{movie?.description}</td>
                  <td> {movie?.ratingOutOfTen}/10</td>
                  <td>Premiere Date: {movie?.premierDate}</td>
                  <td>
                    {movie?.tags.map((tag: string) => (
                      <span className="badge badge-md">
                        {tag}
                        <button
                          onClick={() => deleteTag(tag, movie?.name)}
                          className="btn btn-sm btn-circle btn-ghost text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setTagMovieName(movie?.name);
                        document.getElementById("add_tag")!.showModal();
                      }}
                      className="btn px-5"
                    >
                      +
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => {
                        removeFavoriteMovie(user?.id, movie);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="#000000"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divider"></div>
        <div className="text-xl my-4">Non Favorites</div>

        <div className="overflow-x-auto my-2">
          <table className="table table-xs">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Priemiere Date</th>

                <th>Tags</th>
                <th>Add Tag</th>
                <th>Favorite</th>
              </tr>
            </thead>
            <tbody>
              {nonFavList.map((movie) => (
                <tr>
                  <th>{(count += 1)}</th>
                  <td>{movie?.name}</td>
                  <td>{movie?.description}</td>
                  <td> {movie?.ratingOutOfTen}/10</td>
                  <td>Premiere Date: {movie?.premierDate}</td>

                  <td>
                    {movie?.tags.map((tag: string) => (
                      <span className="badge badge-md">
                        {tag}
                        <button
                          onClick={() => deleteTag(tag, movie?.name)}
                          className="btn btn-sm btn-circle btn-ghost text-sm"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setTagMovieName(movie?.name);
                        document.getElementById("add_tag")!.showModal();
                      }}
                      className="btn px-5"
                    >
                      +
                    </button>
                  </td>

                  <td>
                    <button
                      className="btn"
                      onClick={() => addFavoriteMovie(user!.id, movie)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="overflow-x-auto my-2">
          <table className="table table-xs">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Description</th>
                <th>Rating</th>
                <th>Priemiere Date</th>

                <th>Tags</th>
                <SignedIn>
                  <th>Add Tag</th>

                  <th>Favorite</th>
                </SignedIn>
              </tr>
            </thead>
            <tbody>
              {movielist.map((movie) => (
                <tr>
                  <th>{(count += 1)}</th>
                  <td>{movie?.name}</td>
                  <td>{movie?.description}</td>
                  <td> {movie?.ratingOutOfTen}/10</td>
                  <td>Premiere Date: {movie?.premierDate}</td>

                  <td>
                    {movie?.tags.map((tag: string) => (
                      <span className="badge badge-md">
                        {tag}
                        <button
                          onClick={() => deleteTag(tag, movie?.name)}
                          className="btn btn-sm btn-circle btn-ghost text-sm "
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </td>
                  <SignedIn>
                    <td>
                      <button
                        onClick={() => {
                          setTagMovieName(movie?.name);
                          document.getElementById("add_tag")!.showModal();
                        }}
                        className="btn px-5"
                      >
                        +
                      </button>
                    </td>

                    <td>
                      <button
                        className="btn"
                        onClick={() => addFavoriteMovie(user!.id, movie)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </td>
                  </SignedIn>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SignedOut>

      <dialog id="movie_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{movieFromSearch?.name}</h3>
          <p>Description: {movieFromSearch?.description}</p>
          <p>Rating: {movieFromSearch?.ratingOutOfTen}/10</p>
          <p>Premiere Date: {movieFromSearch?.premierDate}</p>
          <p>{movieFromSearch?.tags}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="no_movie_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">No Movie Found</h3>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <dialog id="add_tag" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg my-3">Add A Tag</h3>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => setTagText(e.target.value)}
          />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                onClick={() => {
                  addATag(tagText, tagMovieName);
                }}
                className="btn mx-2"
              >
                Submit
              </button>
              <button className="btn">Discard</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default App;
