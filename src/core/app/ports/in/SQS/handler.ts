import { Callback } from 'aws-lambda'

export interface Handler<TEvent = any, TContext = any, TResult = any> {
  exec:(
    event: TEvent,
    context: TContext,
    callback: Callback<TResult>
  ) => void | Promise<TResult>;
} 