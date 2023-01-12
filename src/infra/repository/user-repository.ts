import { User } from "../../domain/entities/user";
import { UserRepository } from "../../application/ports/repository/user-repository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findByCPF(cpf: string): Promise<User | undefined> {
    return this.users.find((user) => user.cpf === cpf);
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
}
