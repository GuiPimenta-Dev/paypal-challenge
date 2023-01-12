import { User } from "../../../domain/entities/user";

export interface UserRepository {
  findByCPF(cpf: string): Promise<User | undefined>;
  create(user: User): Promise<void>;
}
