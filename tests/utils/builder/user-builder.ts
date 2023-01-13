import { User, UserCategory } from "../../../src/domain/entities/user";

export class UserBuilder {
  email = "john_doe@gmail.com";
  cpf = "12345678910";
  category: UserCategory;

  static anUser() {
    const user = new UserBuilder();
    user.category = UserCategory.USER;
    return user;
  }

  static aShopkeeper() {
    const shopkeeper = new UserBuilder();
    shopkeeper.category = UserCategory.SHOPKEEPER;
    return shopkeeper;
  }

  withAnotherEmail() {
    this.email = "another_john_doe@gmail.com";
    return this;
  }

  withAnotherCPF() {
    this.cpf = "01234567891";
    return this;
  }

  build() {
    return User.create({
      name: "John Doe",
      password: "123456",
      email: this.email,
      cpf: this.cpf,
      category: this.category,
    });
  }
}
