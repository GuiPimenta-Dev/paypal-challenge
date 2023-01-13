import { CreateUser } from "../src/usecases/create-user";
import { InMemoryUserRepository } from "../src/infra/repository/in-memory-user-repository";
import { UserBuilder } from "./utils/builder/user-builder";

it("should be able to create a new user on database", async () => {
  const userRepository = new InMemoryUserRepository();

  const sut = new CreateUser(userRepository);
  const defaultUser = UserBuilder.aUser().build();
  await sut.execute(defaultUser);

  const user = await userRepository.findByCPF("12345678910");
  expect(user).toHaveProperty("id");
  expect(user.name).toBe("John Doe");
  expect(user.email).toBe("john_doe@gmail.com");
  expect(user.password).toBe("123456");
  expect(user.cpf).toBe("12345678910");
  expect(user.category).toBe("user");
});

it("should not be able to create a new user with an existing CPF", async () => {
  const userRepository = new InMemoryUserRepository();
  const user = UserBuilder.aUser().withCPF("12345678910").build();
  await userRepository.create(user);

  const sut = new CreateUser(userRepository);
  const userWithExistentCPF = UserBuilder.aUser().withCPF("12345678910").build();
  await expect(sut.execute(userWithExistentCPF)).rejects.toThrow("CPF already exists");
});

it("should not be able to create a new user with an existing email", async () => {
  const userRepository = new InMemoryUserRepository();
  const user = UserBuilder.aUser().withEmail("john_doe@gmail.com").build();
  await userRepository.create(user);

  const sut = new CreateUser(userRepository);
  const userWithExistentEmail = UserBuilder.aUser().withCPF("01234567891").withEmail("john_doe@gmail.com").build();
  await expect(sut.execute(userWithExistentEmail)).rejects.toThrow("Email already exists");
});
