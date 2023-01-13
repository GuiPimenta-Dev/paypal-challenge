import { User } from "../../../domain/entities/user";

export interface UserRepository {
  cpfAlreadyExists(cpf: string): Promise<boolean>;
  emailAlreadyExists(email: string): Promise<boolean>;
  findByCPF(cpf: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  create(user: User): Promise<void>;
}
