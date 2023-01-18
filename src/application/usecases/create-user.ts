import { User, UserCategory } from "../../domain/entities/user";

import { BadRequest } from "../../utils/http-status/bad-request";
import { UsersRepository } from "../ports/repositories/users";

interface Dependencies {
  usersRepository: UsersRepository;
}

interface Input {
  name: string;
  email: string;
  password: string;
  cpf: string;
  category: UserCategory;
}

export class CreateUser {
  private readonly usersRepository: UsersRepository;

  constructor(input: Dependencies) {
    Object.assign(this, input);
  }

  async execute(input: Input): Promise<{ userId: string }> {
    if (await this.usersRepository.cpfAlreadyExists(input.cpf)) throw new BadRequest("CPF already exists");
    if (await this.usersRepository.emailAlreadyExists(input.email)) throw new BadRequest("Email already exists");
    const user = User.create(input);
    await this.usersRepository.create(user);
    return { userId: user.id };
  }
}
