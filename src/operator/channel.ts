import { EventEmitter } from 'events';

export class OperatorChannel extends EventEmitter{
  constructor(private sessionID: string) {
    super()
  }
}