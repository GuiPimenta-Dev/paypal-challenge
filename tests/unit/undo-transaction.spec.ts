import { InMemoryTransactionsRepository } from "../../src/infra/repositories/in-memory/transactions";
import { TransactionBuilder } from "../utils/builder/transaction";
import { UndoTransaction } from "../../src/usecases/undo-transaction";
import { UserBuilder } from "../utils/builder/user";

it("should be able to undo a deposit transaction", async () => {
  const user = UserBuilder.aUser().build();
  const transactionsRepository = new InMemoryTransactionsRepository();
  const deposit = TransactionBuilder.aDeposit().of(100).to(user.id).build();
  await transactionsRepository.create(deposit);

  const sut = new UndoTransaction({ transactionsRepository });
  const input = { transactionId: deposit.id };
  await sut.execute(input);

  const balance = await transactionsRepository.calculateBalance(user.id);
  expect(balance).toBe(0);
});

it("should be able to undo a transfer transaction", async () => {
  const payer = UserBuilder.aUser().build();
  const payee = UserBuilder.aUser().build();
  const transactionsRepository = new InMemoryTransactionsRepository();
  const deposit = TransactionBuilder.aDeposit().of(100).to(payer.id).build();
  const transfer = TransactionBuilder.aTransfer().of(100).from(payer.id).to(payee.id).build();
  await transactionsRepository.create(deposit);
  await transactionsRepository.create(transfer);

  const sut = new UndoTransaction({ transactionsRepository });
  const input = { transactionId: transfer.id };
  await sut.execute(input);

  const payerBalance = await transactionsRepository.calculateBalance(payer.id);
  const payeeBalance = await transactionsRepository.calculateBalance(payee.id);
  expect(payerBalance).toBe(100);
  expect(payeeBalance).toBe(0);
});

it("should not be able to undo a non rollbackable transaction", async () => {
  const transactionsRepository = new InMemoryTransactionsRepository();
  const deposit = TransactionBuilder.aDeposit().build();
  const rollback = deposit.rollback();
  await transactionsRepository.create(rollback);

  const sut = new UndoTransaction({ transactionsRepository });
  const input = { transactionId: rollback.id };
  await expect(sut.execute(input)).rejects.toThrow("Transaction cannot be undone");
});

it("should not undo a transaction that was already undone", async () => {
  const transactionsRepository = new InMemoryTransactionsRepository();
  const deposit = TransactionBuilder.aDeposit().build();
  deposit.rollback();
  await transactionsRepository.create(deposit);

  const sut = new UndoTransaction({ transactionsRepository });
  const input = { transactionId: deposit.id };
  await expect(sut.execute(input)).rejects.toThrow("Rollback already done");
});
