import { EmailProvider } from "../../ports/providers/email-provider";
import { Handler } from "./implements/Handler";
import { TransferMade } from "../../domain/events/transfer-made";

export class TransferMadeHandler implements Handler {
  constructor(private emailProvider: EmailProvider) {}
  name = "TransferMade";

  async handle(input: TransferMade): Promise<void> {
    await this.emailProvider.send(input.email, "Transfer Made", `You received a transfer of ${input.value}`);
  }
}
