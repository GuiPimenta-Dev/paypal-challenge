import { CreateUser } from "../../src/usecases/create-user";
import { InMemoryUsersRepository } from "../../src/infra/repositories/in-memory/users";
import { UserBuilder } from "../utils/builder/user";

it("should be able to create a new user on database", async () => {
  const usersRepository = new InMemoryUsersRepository();

  const sut = new CreateUser({ usersRepository });
  const defaultUser = UserBuilder.aUser().build();
  await sut.execute(defaultUser);

  const user = await usersRepository.findByCPF("12345678910");
  expect(user).toHaveProperty("id");
  expect(user.name).toBe("John Doe");
  expect(user.email).toBe("john_doe@gmail.com");
  expect(user.password).toBe("123456");
  expect(user.cpf).toBe("12345678910");
  expect(user.category).toBe("user");
});

it("should not be able to create a new user with an existing CPF", async () => {
  const usersRepository = new InMemoryUsersRepository();
  const user = UserBuilder.aUser().build();
  await usersRepository.create(user);

  const sut = new CreateUser({ usersRepository });
  const userWithExistentCPF = UserBuilder.aUser().build();
  await expect(sut.execute(userWithExistentCPF)).rejects.toThrow("CPF already exists");
});

it("should not be able to create a new user with an existing email", async () => {
  const usersRepository = new InMemoryUsersRepository();
  const user = UserBuilder.aUser().build();
  await usersRepository.create(user);

  const sut = new CreateUser({ usersRepository });
  const userWithExistentEmail = UserBuilder.aUser().withAnotherCPF().build();
  await expect(sut.execute(userWithExistentEmail)).rejects.toThrow("Email already exists");
});
