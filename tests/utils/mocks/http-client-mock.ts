import { HttpClient, HttpOutput } from "../../../src/ports/http/http-client";

export class HttpClientMock implements HttpClient {
  urlCalled: string;

  async get(url: string): Promise<HttpOutput> {
    this.urlCalled = url;
    return { statusCode: 200, data: { message: "Autorizado" } };
  }
}
