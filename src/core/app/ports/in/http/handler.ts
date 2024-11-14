export interface Handler<T, U> {
  exec: (
    event: T,
    context: U, 
  ) => Promise<unknown>
}