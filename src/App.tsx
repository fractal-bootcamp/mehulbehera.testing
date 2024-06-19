import { useEffect, useState } from "react";
import "./App.css";

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

function App() {
  const [movielist, setMovies] = useState([]);
  const [searchText, setSearchBar] = useState("");
  const [movieFromSearch, setMovieSearch] = useState(null);

  let count = 0;

  useEffect(() => {
    async function initialize() {
      const data = await getAllMovies();
      setMovies(data);
    }

    initialize();
  }, []);

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
      <div>
        {movielist.map((movie) => (
          <div className="collapse bg-base-200">
            <input type="radio" name="my-accordion-1" />
            <div className="collapse-title text-xl font-medium">
              {movie?.name}
            </div>
            <div className="collapse-content">
              <p>Description: {movie?.description}</p>
              <p>Rating: {movie?.ratingOutOfTen}/10</p>
              <p>Premiere Date: {movie?.premierDate}</p>
              <p>{movie?.tags}</p>
            </div>
          </div>
        ))}
      </div>

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
