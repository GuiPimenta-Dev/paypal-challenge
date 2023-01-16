import { v4 as uuid } from "uuid";

export enum UserCategory {
  USER = "user",
  SHOPKEEPER = "shopkeeper",
}

interface Input {
  name: string;
  email: string;
  password: string;
  cpf: string;
  category: UserCategory;
}

export class User {
  public readonly id: string;
  public readonly category: UserCategory;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly cpf: string;

  private constructor(props: Input & { id: string }) {
    Object.assign(this, props);
  }

  static create(input: Input): User {
    return new User({ id: uuid(), ...input });
  }
}
