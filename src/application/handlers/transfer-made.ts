import { EmailProvider } from "../ports/providers/email";
import { Handler } from "./implements/handler";

export class TransferMadeHandler implements Handler {
  constructor(private emailProvider: EmailProvider) {}
  name = "TransferMade";

  async handle(): Promise<void> {
    await this.emailProvider.send();
  }
}
