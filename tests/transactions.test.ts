import { InMemoryUserRepository } from "../src/infra/repository/in-memory-user-repository";
import { UserBuilder } from "./utils/builder/user-builder";

it("A user should be able to transfer money to another user", async () => {
  const userRepository = new InMemoryUserRepository();
  const transactionsRepository = new InMemoryTransactionsRepository();
  const payer = UserBuilder.aUser().build();
  const payee = UserBuilder.aUser().withAnotherCPF().withAnotherEmail().build();
  await userRepository.create(payer);
  await userRepository.create(payee);

  const sut = new TransferMoney(userRepository, transactionsRepository);
  const input = { value: 100, payer: payer.id, payee: payee.id };
  const transactionId = await sut.execute(input);

  const transaction = await transactionsRepository.findById(transactionId);
  expect(transaction.senderCPF).toBe("12345678910");
  expect(transaction.receiverCPF).toBe("01234567891");
  expect(transaction.amount).toBe(100);
});
