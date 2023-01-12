import { CreateUser } from "../src/usecases/create-user";
import { InMemoryUserRepository } from "../src/infra/repository/user-repository";

it("should be able to create a new user on database", async () => {
  const userRepository = new InMemoryUserRepository();
  const usecase = new CreateUser(userRepository);
  const input = { name: "John Doe", email: "john_doe@gmail.com", password: "123456", cpf: "12345678910" };

  await usecase.execute(input);

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
  const usecase = new CreateUser(userRepository);
  const input = { name: "John Doe", email: "john_doe@gmail.com", password: "123456", cpf: "12345678910" };
  await usecase.execute(input);

  await expect(usecase.execute(input)).rejects.toThrow("CPF already exists");
});

it("should not be able to create a new user with an existing email", async () => {
  const userRepository = new InMemoryUserRepository();
  const usecase = new CreateUser(userRepository);
  const input = { name: "John Doe", email: "john_doe@gmail.com", password: "123456", cpf: "12345678910" };
  await usecase.execute(input);
  input.cpf = "09876543210";

  await expect(usecase.execute(input)).rejects.toThrow("Email already exists");
});
