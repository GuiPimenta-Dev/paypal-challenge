import { User } from "../../../domain/entities/user";

export interface UsersRepository {
  cpfAlreadyExists(cpf: string): Promise<boolean>;
  emailAlreadyExists(email: string): Promise<boolean>;
  findById(id: string): Promise<User | undefined>;
  create(user: User): Promise<void>;
}
