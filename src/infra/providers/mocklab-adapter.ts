import { EmailProvider } from "../../application/ports/providers/email";
import { HttpClient } from "../../application/ports/http/http-client";

export class MockLabAdapter implements EmailProvider {
  constructor(private httpClient: HttpClient) {}

  async send(): Promise<void> {
    await this.httpClient.get("http://o4d9z.mocklab.io/notify");
  }
}
