import EventEmitter from 'events';
import {Socket} from 'net';
import { OperatorMessageBuilder } from './message.builder';
import { IncomingMessage, IncomingMessageType, AuthMessage, ConnectSessionMessage, GetSessionsMessage } from './operator.messages';
import { typeToValidator, partialValidator } from './validator';

export abstract class OperatorConnection extends EventEmitter{
  constructor() {
    super();
  }

  abstract real(): boolean

  abstract sendActiveSessions(sessions: [deviveID:  string, sessionID: string][])

  abstract sendConnectedToSession(sessionID: string, succeed: boolean)

  static NULL() {
    return new NullOperatorConnection()
  }
}

export class RealOperatorConnection extends OperatorConnection {  
  constructor(private socket: Socket) {
    super();

    this.socket.on('data', rawMessage => 
      this.parse(rawMessage)
      .then( message => this.validate(message) )
      .then( message => this.handle(message) )
      .catch( err => this.onIvalidMessage(rawMessage, err) ));

    this.socket.on('close', () => this.close())

    this.socket.on('error', err => {})
  }

  real() {return true}

  sendActiveSessions(sessions: [deviveID:  string, sessionID: string][]) {
    this.send(OperatorMessageBuilder.activeSessions(sessions))
  }

  sendConnectedToSession(sessionID: string, succeed: boolean) {
    this.send(OperatorMessageBuilder.connectedToSession(sessionID, succeed))
  }

  private send(message: Object) {
    console.log('sent', JSON.stringify(message))
    this.socket.write(Buffer.from(JSON.stringify(message)))
  }

  private sendGotInvalid(originalMessage: string, error: string) {
  }

  private close() {
    console.log('operator connection closed')
    this.emit('close')
  }

  private parse(data: Buffer): Promise<IncomingMessage> {
    return new Promise<IncomingMessage>((res, rej) => {
      console.log('got row message', data.toString());

      let message: IncomingMessage

      try {
        message = JSON.parse(data.toString());
      }
      catch (err) {
        rej(new Error('message is not a json object'));
        return;
      }

      res(message);
    })
  }

  private validate(message: IncomingMessage) {
    return new Promise<IncomingMessage>((res, rej) => {
      
      if(partialValidator(message)) {
        const typedValidator = typeToValidator[message.type];

        if(typedValidator(message)) {
          res(message);
        }
        else {
          rej(new Error(JSON.stringify(typedValidator.errors)));
        }
      }
      else {
        rej(new Error(JSON.stringify(partialValidator.errors)));
      }
    })
  }
  // TODO fix any type
  private handle(message: any) {
    switch (message.type) {
      case IncomingMessageType.auth: this.emit('auth', message); break;
      case IncomingMessageType.activeSessions: this.emit('get_sessions', message); break;
      case IncomingMessageType.connectToSession: this.emit('connect_to_session', message); break;
    }
  }

  private onIvalidMessage(rawMessage: Buffer, err: Error): void {
    // TODO add normal logging
    console.log('invalid_message', err.message);
    this.sendGotInvalid(rawMessage.toString(), err.message);
    // this.emit('invalid_message', err.message);
  }
}
  
export declare interface OperatorConnection {
  emit(event: 'auth', message: AuthMessage): boolean;
  emit(event: 'get_sessions', message: GetSessionsMessage): boolean
  emit(event: 'connect_to_session', message: ConnectSessionMessage):  boolean
  emit(event: 'close'): boolean

  on(event: 'get_sessions', listener: (message: GetSessionsMessage) => void): this;
  on(event: 'connect_to_session', listener: (message: ConnectSessionMessage) => void): this;

  once(event: 'auth', listener: (message: AuthMessage) => void): this;
  once(event: 'close', listener: () => void): this;
}

export class NullOperatorConnection extends OperatorConnection {
  real() {return false}

  sendActiveSessions(sessions: [deviveID:  string, sessionID: string][]) {}

  sendConnectedToSession(sessionID: string, succeed: boolean) {}
}
