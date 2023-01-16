import { HttpClient, HttpOutput } from "../../../src/ports/http/http-client";

export class HttpClientMock implements HttpClient {
  calledUrls: string[] = [];

  async get(url: string): Promise<HttpOutput> {
    this.calledUrls.push(url);
    return { statusCode: 200, data: { message: "Autorizado" } };
  }
}
