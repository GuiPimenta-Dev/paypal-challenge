import { AuthorizerProvider } from "../../ports/providers/authorizer";

export class MockyAuthorizer implements AuthorizerProvider {
  async isAuthorized(): Promise<boolean> {
    return true;
  }
}
