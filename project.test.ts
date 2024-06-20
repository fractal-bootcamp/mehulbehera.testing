import { beforeEach, describe, expect, it } from "vitest";
import client from "./client";
import seed from "./seed";

beforeEach(async () => {
  await seed();
});

describe("check environment variables", () => {
  it("should return the expect postgres database url", () => {
    expect(process.env.DATABASE_URL).toBe(
      "postgresql://postgres:postgres@localhost:10101/postgres"
    );
  });
});

describe("find all works", () => {
  it("finds all of the items in the database", async () => {
    const users = await client.user.findMany();

    expect(users.length).toEqual(2);
  });
});
