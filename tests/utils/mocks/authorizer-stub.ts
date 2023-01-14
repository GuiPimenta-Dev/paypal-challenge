export class AuthorizerStub {
  private status = true;

  async isAuthorized(): Promise<boolean> {
    return this.status;
  }

  mockResponse(status: boolean): void {
    this.status = status;
  }
}
