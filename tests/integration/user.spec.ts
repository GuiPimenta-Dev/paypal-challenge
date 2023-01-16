import { InMemoryUsersRepository } from "../../src/infra/repositories/in-memory/users";
import { UserBuilder } from "../utils/builder/user";
import { app } from "../../src/router";
import { config } from "../../src/config";
import request from "supertest";

beforeEach(async () => {
  config.usersRepository = new InMemoryUsersRepository();
});

it("Should be able to create an user", async () => {
  const user = UserBuilder.aUser().build();

  const sut = await request(app)
    .post("/users")
    .send({ ...user });

  expect(sut.statusCode).toBe(201);
  expect(sut.body).toHaveProperty("userId");
});
