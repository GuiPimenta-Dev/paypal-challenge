import { User, UserCategory } from "../domain/entities/user";

import { BadRequest } from "../utils/http/bad-request";
import { UsersRepository } from "../ports/repositories/users";

interface Input {
  name: string;
  email: string;
  password: string;
  cpf: string;
  category: UserCategory;
}

export class CreateUser {
  constructor(private userRepository: UsersRepository) {}

  async execute(input: Input): Promise<{ userId: string }> {
    if (await this.userRepository.cpfAlreadyExists(input.cpf)) throw new BadRequest("CPF already exists");
    if (await this.userRepository.emailAlreadyExists(input.email)) throw new BadRequest("Email already exists");
    const user = User.create(input);
    await this.userRepository.create(user);
    return { userId: user.id };
  }
}
