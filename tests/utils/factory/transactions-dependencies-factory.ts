import { Transaction, TransactionType } from "../../../src/domain/entities/transaction";
import { User, UserCategory } from "../../../src/domain/entities/user";

import { ExternalAuthorizerStub } from "../mocks/authorizer-stub";
import { InMemoryTransactionsRepository } from "../../../src/infra/repository/in-memory/transaction-repository";
import { InMemoryUserRepository } from "../../../src/infra/repository/in-memory/user-repository";

export class TransactionsDependenciesFactory {
  public dependencies = {
    userRepository: new InMemoryUserRepository(),
    transactionsRepository: new InMemoryTransactionsRepository(),
    externalAuthorizer: new ExternalAuthorizerStub(),
  };

  createUser(): string {
    const user = new User({
      name: "John Doe",
      password: "123456",
      email: "john_doe@gmail.com",
      cpf: "12345678910",
      category: UserCategory.USER,
    });
    this.dependencies.userRepository.create(user);
    return user.id;
  }

  createPayee() {
    const payee = new User({
      name: "John Doe",
      password: "123456",
      email: "another_john_doe@gmail.com",
      cpf: "01234567891",
      category: UserCategory.USER,
    });
    this.dependencies.userRepository.create(payee);
    return payee.id;
  }

  createShopkeeper() {
    const shopkeeper = new User({
      name: "John Doe",
      password: "123456",
      email: "john_doe@gmail.com",
      cpf: "12345678910",
      category: UserCategory.SHOPKEEPER,
    });
    this.dependencies.userRepository.create(shopkeeper);
    return shopkeeper.id;
  }

  makeDeposit(userId: string, value: number) {
    const transaction = new Transaction({ value, payeeId: userId, type: TransactionType.DEPOSIT });
    this.dependencies.transactionsRepository.create(transaction);
    return transaction;
  }

  mockAuthorizerResponse(status: boolean) {
    this.dependencies.externalAuthorizer.mockResponse(status);
  }
}
