import { User } from "../domain/entities/user";
import { UserRepository } from "../application/ports/repository/user-repository";

interface Input {
  name: string;
  email: string;
  password: string;
  cpf: string;
}

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(input: Input): Promise<void> {
    if (await this.userRepository.cpfExists(input.cpf)) throw new Error("CPF already exists");
    if (await this.userRepository.emailExists(input.email)) throw new Error("Email already exists");
    const user = new User(input);
    await this.userRepository.create(user);
  }
}
