import { v4 as uuid } from "uuid";

export enum UserCategory {
  USER = "user",
  SHOPKEEPER = "shopkeeper",
}

export class User {
  public readonly id: string;
  public readonly category: UserCategory;
  public name: string;
  public email: string;
  public password: string;
  public cpf: string;

  constructor(props: Omit<User, "id">, id?: string) {
    Object.assign(this, props);
    if (!id) {
      this.id = uuid();
    }
  }
}
