import { v4 as uuid } from "uuid";

export enum UserCategory {
  USER = "user",
  SHOPKEEPER = "shopkeeper",
}

export class User {
  public readonly id: string;
  public readonly category: UserCategory;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly cpf: string;

  constructor(props: Omit<User, "id">, id?: string) {
    Object.assign(this, props);
    if (!id) {
      this.id = uuid();
    }
  }
}
