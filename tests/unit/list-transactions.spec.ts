import { InMemoryTransactionsRepository } from "../../src/infra/repositories/in-memory/transactions";
import { InMemoryUsersRepository } from "../../src/infra/repositories/in-memory/users";
import { ListTransactions } from "../../src/usecases/list-transactions";
import { TransactionBuilder } from "../utils/builder/transaction";
import { UserBuilder } from "../utils/builder/user";

it("should be able to list all transactions from a user", async () => {
  const usersRepository = new InMemoryUsersRepository();
  const payer = UserBuilder.aUser().build();
  const payee = UserBuilder.aUser().build();
  await usersRepository.create(payer);
  const transactionsRepository = new InMemoryTransactionsRepository();
  const deposit = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  const transfer = TransactionBuilder.aTransfer().of(50).from(payer.id).to(payee.id).build();
  const rollbackTransfer = transfer.createRollback();
  const rollbackDeposit = deposit.createRollback();
  await transactionsRepository.create(deposit);
  await transactionsRepository.create(transfer);
  await transactionsRepository.create(rollbackTransfer);
  await transactionsRepository.create(rollbackDeposit);

  const sut = new ListTransactions({ usersRepository, transactionsRepository });
  const result = await sut.execute({ userId: payer.id });

  expect(result.transactions).toEqual([deposit, transfer, rollbackTransfer, rollbackDeposit]);
  expect(result.balance).toBe(0);
});
