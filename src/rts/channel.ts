import {Socket} from 'net'
import {EventEmitter} from 'events'
import { IncomingMessage, IncomingMessageType, AuthMessage, AcceptedMessage, TelemetryMessage, MineFoundMessage, EndMessage } from './rts-messages';
import {RTSMessageBuilder} from './message-builder';
import {typeToValidator, generalValidator} from './validator/validator';

export class SafeChannel extends EventEmitter {  
  constructor(private socket: Socket) {
    super()

    this.socket.on('data', data => 
      this.parse(data)
      .then( message => this.validate(message) )
      .then( message => this.handle(message) )
      .catch( err => this.onIvalidMessage(err) ));
  }

  sendMission(mission: [latitude: number, longitude: number][]) {
    this.send(RTSMessageBuilder.mission(mission));
  }

  private send(message: Object) {
    this.socket.write(Buffer.from(JSON.stringify(message)))
  }

  private parse(data: Buffer): Promise<IncomingMessage> {
    return new Promise<IncomingMessage>((res, rej) => {
      console.log('got row message', data.toString());

      let message: IncomingMessage

      try {
        message = JSON.parse(data.toString());
      }
      catch (err) {
        rej(this.invalidMessageErrorBuilder(data.toString(), 'message is not a json object'));
        return;
      }

      res(message);
    })
  }

  private validate(message: IncomingMessage) {
    return new Promise<IncomingMessage>((res, rej) => {
      
      if(generalValidator(message)) {
        const typedValidator = typeToValidator[message.type];

        if(typedValidator(message)) {
          res(message);
        }
        else {
          rej(new Error(JSON.stringify(typedValidator.errors)));
        }
      }
      else {
        rej(new Error(JSON.stringify(generalValidator.errors)));
      }
    })
  }
  // TODO fix any type
  private handle(message: any) {
    console.log('got message', message);

    switch (message.type) {
      case IncomingMessageType.auth: this.emit('auth', message); break; 
      case IncomingMessageType.accepted: this.emit('accepted', message); break; 
      case IncomingMessageType.telemetry: this.emit('telemetry', message); break; 
      case IncomingMessageType.mineFound: this.emit('mine_found', message); break; 
      case IncomingMessageType.endOfMission: this.emit('end_of_mission', message); break; 
    }
  }

  private invalidMessageErrorBuilder(data: string, reason: string): Error {
    return new Error(`" ${data} " ${reason}`);
  }

  private onIvalidMessage(err: Error): void {
    // TODO add normal logging
    console.log('invalid_message', err.message)
    this.emit('invalid_message', err.message);
  }

}

export declare interface SafeChannel {
  emit(event: 'invalid_message', message: Buffer | string): boolean;
  emit(event: 'auth', message: AuthMessage): boolean;
  emit(event: 'accepted', message: AcceptedMessage): boolean;
  emit(event: 'telemetry', message: TelemetryMessage): boolean;
  emit(event: 'mine_found', message: MineFoundMessage): boolean;
  emit(event: 'end_of_mission', message: EndMessage): boolean;

  on(message: 'invalid_message', listener: (message: Buffer | string) => void): this;
  on(message: 'auth', listener: (message: AuthMessage) => void): this;
  on(message: 'accepted', listener: (message: AcceptedMessage) => void): this;
  on(message: 'telemetry', listener: (message: TelemetryMessage) => void): this;
  on(message: 'mine_found', listener: (message: MineFoundMessage) => void): this;
  on(message: 'end_of_mission', listener: (message: EndMessage) => void): this;
}