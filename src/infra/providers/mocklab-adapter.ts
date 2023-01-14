import { EmailProvider } from "../../ports/providers/email";
import { HttpClient } from "../../ports/http/http-client";

export class MockLabAdapter implements EmailProvider {
  constructor(private httpClient: HttpClient) {}

  async send(): Promise<void> {
    await this.httpClient.get("http://o4d9z.mocklab.io/notify");
  }
}
