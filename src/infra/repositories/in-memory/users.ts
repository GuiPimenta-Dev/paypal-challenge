import { User } from "../../../domain/entities/user";
import { UsersRepository } from "../../../ports/repositories/users";

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async cpfAlreadyExists(cpf: string): Promise<boolean> {
    return this.users.some((user) => user.cpf === cpf);
  }

  async emailAlreadyExists(email: string): Promise<boolean> {
    return this.users.some((user) => user.email === email);
  }

  async findByCPF(cpf: string): Promise<User | undefined> {
    return this.users.find((user) => user.cpf === cpf);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
}
