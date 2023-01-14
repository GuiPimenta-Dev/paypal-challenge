export interface AuthorizerProvider {
  isAuthorized(): Promise<boolean>;
}
