import { HttpClient } from "../../ports/http/http-client";
import { HttpError } from "../../utils/http/extends/http-error";
import { HttpOutput } from "../../ports/http/http-output";
import axios from "axios";

export class AxiosAdapter implements HttpClient {
  async get(url: string, query?: any, headers?: any): Promise<HttpOutput> {
    let response: any;
    try {
      response = await axios.get(url, { params: query, headers });
    } catch (error: any) {
      throw new HttpError(error.response.status, error.response.data);
    }
    return { statusCode: response.status, data: response.data };
  }
}
