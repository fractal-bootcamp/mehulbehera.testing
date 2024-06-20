import { beforeAll, describe, expect, test } from "vitest";
const serverPath = "http://localhost:3000";

describe("Test Find All Movies", () => {
  test("should return all movies", async () => {
    const response = await fetch(`${serverPath}/findAllMovies`);
    const json = await response.json();
    expect(json.length).toBe(4);
  });
});

describe("Find Individual movie", () => {
  test("should return the specified movie", async () => {
    const starWars = {
      id: 1,
      name: "Return of the Jedi",
      premierDate: "May 25, 1983",
      ratingOutOfTen: 8,
      description: "The final movie in the original starwars trilogy ",
      tags: ["Action"],
    };
    const movieName = "Return of the Jedi";
    const response = await fetch(`${serverPath}/findMovie/${movieName}`);
    const json = await response.json();
    expect(json).toMatchObject(starWars);
  });
});

//should be undefined bc no clerk id
describe("Add Favorite movie for a given user", () => {
  test("should add a favorite movie", async () => {
    const id = "Billy";
    const movie = "The Purge";
    const response = await fetch(`${serverPath}/addFavorite`, {
      method: "POST",
      body: JSON.stringify({ id, movie }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(response.status).toBe(400);
  });
});

describe("Remove Favorite for a given user", () => {
  test("should remove a favorite movie", async () => {
    const id = "Billy";
    const movie = "Return of the Jedi";
    const response = await fetch(`${serverPath}/removeFavorite`, {
      method: "POST",
      body: JSON.stringify({ id, movie }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(response.status).toBe(400);
  });
});

describe("Add a tag for a given movie", () => {
  test("should add a tag to the movie", async () => {
    const movieName = "The Purge";
    const tag = "Horror";
    const response = await fetch(`${serverPath}/addATag`, {
      method: "POST",
      body: JSON.stringify({ tag, movieName }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    expect(json.tags.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Remove a tag for a given movie", () => {
  test("should remove a tag from the movie", async () => {
    const movieName = "The Purge";
    const tag = "Horror";
    const response = await fetch(`${serverPath}/deleteTag`, {
      method: "POST",
      body: JSON.stringify({ tag, movieName }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    expect(json.tags.length).toBe(0);
  });
});
