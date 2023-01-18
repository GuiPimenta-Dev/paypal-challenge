import { HttpClient } from "../../../src/application/ports/http/http-client";
import { HttpOutput } from "../../../src/application/ports/http/http-output";

export class HttpClientSpy implements HttpClient {
  calledUrls: string[] = [];

  constructor(private readonly httpClient: HttpClient) {}

  async get(url: string): Promise<HttpOutput> {
    this.calledUrls.push(url);
    return this.httpClient.get(url);
  }
}
