import { useEffect, useState } from "react";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";

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
  console.log(json);
  return json;
}

function App() {
  const [movielist, setMovies] = useState([]);
  const [searchText, setSearchBar] = useState("");
  const [movieFromSearch, setMovieSearch] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const [favMovieList, setFavMovies] = useState([]);

  let count = 0;

  useEffect(() => {
    async function initialize() {
      const data = await getAllMovies();
      setMovies(data);
    }

    initialize();
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      createOrUpdateUser(user!.id, user!.firstName);
      async function setupMovies() {
        const favMovies = await getUserFavMovies(user!.id);
        setFavMovies(favMovies);
      }
      setupMovies();
    }
  }, [isSignedIn]);

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
                <SignedIn>
                  <th>Favorite</th>
                </SignedIn>
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
                  <td>{movie?.tags}</td>
                  <SignedIn>
                    <td>
                      <button
                        className="btn"
                        onClick={() => console.log(movie)}
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
                  </SignedIn>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divider"></div>
      </SignedIn>

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
                <td>{movie?.tags}</td>
                <SignedIn>
                  <td>
                    <button className="btn" onClick={() => console.log(movie)}>
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
    </>
  );
}

export default App;

//Acoordion

// <div>
// {movielist.map((movie) => (
//   <div className="collapse bg-base-200">
//     <input type="radio" name="my-accordion-1" />
//     <div className="collapse-title text-xl font-medium">
//       {movie?.name}
//     </div>
//     <div className="collapse-content">
//       <p>Description: {movie?.description}</p>
//       <p>Rating: {movie?.ratingOutOfTen}/10</p>
//       <p>Premiere Date: {movie?.premierDate}</p>
//       <p>{movie?.tags}</p>
//     </div>
//   </div>
// ))}
// </div>
