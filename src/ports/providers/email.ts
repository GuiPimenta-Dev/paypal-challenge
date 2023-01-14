export interface EmailProvider {
  send(): Promise<void>;
}
