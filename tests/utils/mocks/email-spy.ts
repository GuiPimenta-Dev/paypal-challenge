import { EmailProvider } from "../../../src/ports/providers/email";

export class EmailSpy implements EmailProvider {
  public wasCalled = false;
  public calledTimes = 0;

  async send(): Promise<void> {
    this.wasCalled = true;
    this.calledTimes += 1;
  }
}
