import { EmailProvider } from "../../../src/ports/providers/email-provider";

export class EmailSpy implements EmailProvider {
  public to: string;
  public subject: string;
  public body: string;

  async send(to: string, subject: string, body: string): Promise<void> {
    this.to = to;
    this.subject = subject;
    this.body = body;
  }
}
