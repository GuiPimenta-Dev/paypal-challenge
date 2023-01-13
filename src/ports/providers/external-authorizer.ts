export interface ExternalAuthorizer {
  isAuthorized(): Promise<boolean>;
}
