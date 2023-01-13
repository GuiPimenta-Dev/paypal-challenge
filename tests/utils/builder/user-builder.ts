import { User, UserCategory } from "../../../src/domain/entities/user";

export class UserBuilder {
  email = "john_doe@gmail.com";
  cpf = "12345678910";
  category: UserCategory = UserCategory.USER;

  static aUser() {
    return new UserBuilder();
  }

  withAnotherEmail() {
    this.email = "another_john_doe@gmail.com";
    return this;
  }

  withAnotherCPF() {
    this.cpf = "01234567891";
    return this;
  }

  asShopkeeper() {
    this.category = UserCategory.SHOPKEEPER;
    return this;
  }

  build() {
    return new User({
      name: "John Doe",
      password: "123456",
      email: this.email,
      cpf: this.cpf,
      category: this.category,
    });
  }
}
