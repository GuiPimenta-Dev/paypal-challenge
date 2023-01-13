import { DepositMoney } from "../src/usecases/deposit-money";
import { InMemoryTransactionsRepository } from "../src/infra/repository/in-memory/transaction-repository";
import { InMemoryUserRepository } from "../src/infra/repository/in-memory/user-repository";
import { TransactionType } from "../src/domain/entities/transaction";
import { TransferMoney } from "../src/usecases/transfer-money";
import { UserBuilder } from "./utils/builder/user-builder";

it("should be able to deposit money", async () => {
  const userRepository = new InMemoryUserRepository();
  const transactionsRepository = new InMemoryTransactionsRepository();
  const user = UserBuilder.aUser().build();
  await userRepository.create(user);

  const sut = new DepositMoney(userRepository, transactionsRepository);
  const input = { value: 100, userId: user.id };
  await sut.execute(input);

  const balance = await transactionsRepository.calculateBalance(user.id);
  expect(balance).toBe(100);
});

it("A user should be able to transfer money to another user", async () => {
  const userRepository = new InMemoryUserRepository();
  const transactionsRepository = new InMemoryTransactionsRepository();
  const payer = UserBuilder.aUser().build();
  const payee = UserBuilder.aUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);
  await new DepositMoney(userRepository, transactionsRepository).execute({ value: 100, userId: payer.id });

  const sut = new TransferMoney(userRepository, transactionsRepository);
  const input = { value: 100, payerId: payer.id, payeeId: payee.id };
  const { transactionId } = await sut.execute(input);

  const transaction = await transactionsRepository.findById(transactionId);
  expect(transaction.payerId).toBe(payer.id);
  expect(transaction.payeeId).toBe(payee.id);
  expect(transaction.value).toBe(100);
});
