import { User } from "../../../domain/entities/user";

export interface UserRepository {
  cpfExists(cpf: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
  findByCPF(cpf: string): Promise<User | undefined>;
  create(user: User): Promise<void>;
}
