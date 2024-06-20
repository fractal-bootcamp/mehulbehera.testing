import client from "./client";

const seed = async () => {
  await client.user.deleteMany({
    where: {},
  });

  const users = await client.user.createMany({
    data: [
      {
        id: 1,
        name: "Jake",
      },
      {
        id: 2,
        name: "Andrew",
      },
    ],
  });
};

export default seed;
