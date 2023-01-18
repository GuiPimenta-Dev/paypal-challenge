import { AuthorizerProvider } from "../../application/ports/providers/authorizer";
import { HttpClient } from "../../application/ports/http/http-client";

export class MockyAdapter implements AuthorizerProvider {
  constructor(private httpClient: HttpClient) {}

  async isAuthorized(): Promise<boolean> {
    const { data } = await this.httpClient.get("https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6");
    return data.message === "Autorizado";
  }
}
