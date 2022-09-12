import EventEmitter from 'events';
import {AssemblingSocket} from '@protocol/assembler';
import {OperatorMessageBuilder} from './message.builder';
import {AuthMessage, ConnectSessionMessage, GetSessionsMessage, IncomingMessage, IncomingMessageType, OutcomingMessage, StartMissionMessage} from './operator.messages';
import {partialValidator, typeToValidator} from './validator';
import { SessionInfo } from '@srv/messanger/session.info';

export abstract class OperatorConnection extends EventEmitter {
  constructor() {
    super();
  }

  abstract real(): boolean;

  abstract sendActiveSessions(sessions: SessionInfo[]);
  abstract sendConnectedToSession(sessionID: string, succeed: boolean);
  abstract sendMissionStarted(sessionID: string, accepted: boolean);
  abstract sendTelemetry(sessionID: string, latitude: number, longitude: number, compass: number);
  abstract sendSoilSample(sessionID: string, latitude: number, longitude: number);
  abstract sendExpressTest(sessionID: string, latitude: number, longitude: number, temperature: number, humidity: number, ph: number);
  abstract sendVideoFrame(sessionID: string, width: number, height: number, frame: string);

  static NULL() {
    return new NullOperatorConnection();
  }
}

export class RealOperatorConnection extends OperatorConnection {  
  constructor(private channel: AssemblingSocket) {
    super();

    this.channel.on('message', rawMessage => 
      this.parse(rawMessage)
        .then( message => this.validate(message) )
        .then( message => this.handle(message) )
        .catch( err => this.onIvalidMessage(rawMessage, err) ));

    this.channel.once('close', () => this.close());

    this.channel.once('error', err => {
      console.log('socket err', err);
    });
  }

  real() {return true;}

  sendActiveSessions(sessions: SessionInfo[]) {
    this.send(OperatorMessageBuilder.activeSessions(sessions));
  }

  sendConnectedToSession(sessionID: string, succeed: boolean) {
    this.send(OperatorMessageBuilder.connectedToSession(sessionID, succeed));
  }

  sendMissionStarted(sessionID: string, accepted: boolean) {
    this.send(OperatorMessageBuilder.missionStarted(sessionID, accepted));
  }

  sendTelemetry(sessionID: string, latitude: number, longitude: number, compass: number) {
    this.send(OperatorMessageBuilder.telemetry(
      sessionID,
      latitude,
      longitude,
      compass,
    ));
  }

  sendSoilSample(sessionID: string, latitude: number, longitude: number) {
    this.send(OperatorMessageBuilder.soilSample(
      sessionID,
      latitude,
      longitude
    ));
  }

  sendExpressTest(sessionID: string, latitude: number, longitude: number, temperature: number, humidity: number, ph: number) {
    this.send(OperatorMessageBuilder.expressTest(
      sessionID,
      latitude,
      longitude,
      temperature,
      humidity,
      ph
    ));
  }

  sendVideoFrame(sessionID: string, width: number, height: number, frame: string) {
    console.log('sent frame')
    this.send(OperatorMessageBuilder.videoFrame(sessionID, width, height, frame));
  }

  private send(message: OutcomingMessage) {
    this.channel.send(Buffer.from(JSON.stringify(message), 'ascii'));
  }

  private sendGotInvalid(originalMessage: string, error: string) {
    console.error('operator got invalid message', error);
  }

  private close() {
    console.log('operator connection closed');
    this.emit('close');
  }

  private parse(data: Buffer): Promise<IncomingMessage> {
    return new Promise<IncomingMessage>((res, rej) => {
      console.log('got row message', data.toString());

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
    });
  }
  // TODO fix any type
  private handle(message: any) {
    switch (message.type) {
    case IncomingMessageType.auth: this.emit('auth', message); break;
    case IncomingMessageType.activeSessions: this.emit('get_sessions', message); break;
    case IncomingMessageType.connectToSession: this.emit('connect_to_session', message); break;
    case IncomingMessageType.startMission: this.emit('start_mission', message); break;
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
  emit(event: 'connect_to_session', message: ConnectSessionMessage): boolean
  emit(event: 'start_mission', message: StartMissionMessage): boolean
  emit(event: 'close'): boolean

  on(event: 'get_sessions', listener: (message: GetSessionsMessage) => void): this;
  on(event: 'connect_to_session', listener: (message: ConnectSessionMessage) => void): this;
  on(event: 'start_mission', listener: (message: StartMissionMessage) => void): this;

  once(event: 'auth', listener: (message: AuthMessage) => void): this;
  once(event: 'close', listener: () => void): this;
}

export class NullOperatorConnection extends OperatorConnection {
  real() {return false;}

  /* eslint-disable */
  sendActiveSessions(sessions: SessionInfo[]) {}
  sendConnectedToSession(sessionID: string, succeed: boolean) {}
  sendMissionStarted(sessionID: string, accepted: boolean) {}
  sendTelemetry(sessionID: string, latitude: number, longitude: number, compass: number) {}
  sendSoilSample(sessionID: string, latitude: number, longitude: number) {}
  sendExpressTest(sessionID: string, latitude: number, longitude: number, temperature: number, humidity: number, ph: number) {}
  sendVideoFrame(sessionID: string, width: number, height: number, frame: string) {}
  /* eslint-enable */
}
