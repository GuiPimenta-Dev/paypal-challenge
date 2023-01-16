import { User } from "../../domain/entities/user/user";

export interface UsersRepository {
  cpfAlreadyExists(cpf: string): Promise<boolean>;
  emailAlreadyExists(email: string): Promise<boolean>;
  findByCPF(cpf: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(user: User): Promise<void>;
}
