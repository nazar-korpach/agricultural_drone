import {EventEmitter} from 'events';
import {AssemblingSocket} from '@srv/protocol';
import {RTSMessageBuilder} from './message-builder';
import {AcceptedMessage, AuthMessage, EndMessage, ExpressTestMessage, IncomingMessage, IncomingMessageType, OutcomingMessage, SoilSampleMessage, TelemetryMessage, VideoFrameMessage} from './rts-messages';
import {generalValidator, typeToValidator} from './validator/validator';

export class SafeChannel extends EventEmitter implements DroneChannel {  
  constructor(private socket: AssemblingSocket) {
    super();

    this.socket.on('message', rawMessage => 
      this.parse(rawMessage)
        .then( message => this.validate(message) )
        .then( message => this.handle(message) )
        .catch( err => this.onIvalidMessage(rawMessage, err) ));

    this.socket.once('error', error => {
      console.error('error in drone connection', error);
    });

    this.socket.once('close', () => {
      console.log('drone connection closed');
      this.emit('close');
    });
  }

  sendMission(mission: [latitude: number, longitude: number][]) {
    this.send(RTSMessageBuilder.mission(mission));
  }

  close() {
    this.socket.close();
    this.emit('close');
  }

  private send(message: OutcomingMessage) {
    this.socket.send(Buffer.from(JSON.stringify(message)));
  }

  private sendGotInvalid(originalMessage: string, error: string) {
    this.send(RTSMessageBuilder.invalid(originalMessage, error));
  }

  private parse(data: Buffer): Promise<IncomingMessage> {
    return new Promise<IncomingMessage>((res, rej) => {
      let message: IncomingMessage;

      try {
        message = JSON.parse(data.toString());
      }
      catch (err) {
        rej(new Error('message is not a json object'));
        return;
      }

      res(message);
    });
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
    });
  }
  // TODO fix any type
  private handle(message: any) {
    console.log('got message', message.type);

    switch (message.type) {
    case IncomingMessageType.auth: this.emit('auth', message); break; 
    case IncomingMessageType.accepted: this.emit('accepted', message); break; 
    case IncomingMessageType.telemetry: this.emit('telemetry', message); break;
    case IncomingMessageType.videoFrame: this.emit('video_frame', message); break;
    case IncomingMessageType.endOfMission: this.emit('end_of_mission', message); break; 
    }
  }

  private onIvalidMessage(rawMessage: Buffer, err: Error): void {
    // TODO add normal logging
    console.log('invalid_message', err.message);
    this.sendGotInvalid(rawMessage.toString(), err.message);
    this.emit('invalid_message', err.message);
  }

}

export declare interface DroneChannel {
  sendMission(mission: [latitude: number, longitude: number][]): void

  close(): void;

  emit(event: 'error', error: Error): void;
  emit(event: 'close'): void;
  emit(event: 'invalid_message', message: string): boolean;
  emit(event: 'auth', message: AuthMessage): boolean;
  emit(event: 'accepted', message: AcceptedMessage): boolean;
  emit(event: 'telemetry', message: TelemetryMessage): boolean;
  emit(event: 'soil_sample', message: SoilSampleMessage): boolean;
  emit(event: 'express_test', message: ExpressTestMessage): boolean;
  emit(event: 'video_frame', message: VideoFrameMessage): boolean;
  emit(event: 'end_of_mission', message: EndMessage): boolean;

  once(message: 'error', listener: (error: Error) => void): this;
  once(message: 'close', listener: () => void): this;

  on(message: 'invalid_message', listener: (message: string) => void): this;
  on(message: 'auth', listener: (message: AuthMessage) => void): this;
  on(message: 'accepted', listener: (message: AcceptedMessage) => void): this;
  on(message: 'telemetry', listener: (message: TelemetryMessage) => void): this;
  on(message: 'soil_sample', listener: (message: SoilSampleMessage) => void): this;
  on(message: 'express_test', listener: (message: ExpressTestMessage) => void): this;
  on(message: 'video_frame', listener: (message: VideoFrameMessage) => void): this;
  on(message: 'end_of_mission', listener: (message: EndMessage) => void): this;
}