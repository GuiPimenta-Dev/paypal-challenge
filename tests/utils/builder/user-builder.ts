import { User, UserCategory } from "../../../src/domain/entities/user";

export class UserBuilder {
  email = "john_doe@gmail.com";
  cpf = "12345678910";
  category: UserCategory = UserCategory.USER;

  static aUser() {
    return new UserBuilder();
  }

  withEmail(email: string) {
    this.email = email;
    return this;
  }

  withCPF(cpf: string) {
    this.cpf = cpf;
    return this;
  }

  withCategory(category: UserCategory) {
    this.category = category;
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
