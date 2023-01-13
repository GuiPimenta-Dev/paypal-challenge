export class Account {
  public readonly userId: string;
  public readonly balance: number;

  constructor(props: Account) {
    Object.assign(this, props);
  }
}
