export abstract class Item {
  abstract get pk (): string
  abstract get sk (): string

  public keys () {
    return {
      PK: this.pk,
      SK: this.sk
    }
  }
  
  public keysValue () {
    return {
      PK: { S: this.pk },
      SK: { S: this.sk }
    }
  }
}
