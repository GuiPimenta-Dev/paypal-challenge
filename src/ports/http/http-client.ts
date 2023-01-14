export interface HttpInput {
  query: any;
  body: any;
  headers: any;
  path: any;
  file: any;
}

export interface HttpOutput {
  statusCode: number;
  data: any;
}

export interface HttpClient {
  get(url: string, query?: any, headers?: any): Promise<HttpOutput>;
  post(url: string, body: any, headers?: any): Promise<HttpOutput>;
  put(url: string, body: any, headers?: any): Promise<HttpOutput>;
}
