import { InMemoryTransactionsRepository } from "../src/infra/repository/in-memory/transaction-repository";
import { InMemoryUserRepository } from "../src/infra/repository/in-memory/user-repository";
import { TransferMoney } from "../src/usecases/transfer-money";
import { UserBuilder } from "./utils/builder/user-builder";

it("A user should be able to transfer money to another user", async () => {
  const userRepository = new InMemoryUserRepository();
  const transactionsRepository = new InMemoryTransactionsRepository();
  const payer = UserBuilder.aUser().build();
  const payee = UserBuilder.aUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);

  const sut = new TransferMoney(userRepository, transactionsRepository);
  const input = { value: 100, payerId: payer.id, payeeId: payee.id };
  const { transactionId } = await sut.execute(input);

  const transaction = await transactionsRepository.findById(transactionId);
  expect(transaction.payerId).toBe(payer.id);
  expect(transaction.payeeId).toBe(payee.id);
  expect(transaction.value).toBe(100);
});
