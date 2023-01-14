import { EmailProvider } from "../../../src/ports/providers/email";

export class EmailSpy implements EmailProvider {
  public wasCalled = false;

  async send(): Promise<void> {
    this.wasCalled = true;
  }
}
