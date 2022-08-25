import { OperatorChannel } from '@srv/operator';
import { DroneMessanger } from './messanger';

export abstract class SessionsInteractor {
  abstract getSessions(): Promise<[deviceID: string, sessionID: string][]> 

  abstract connect(channel: OperatorChannel, sessionID: string): Promise<void>

  static NULL() {
    return new NullSessionsInteractor()
  }
}

export class RealSessionsInteractor extends SessionsInteractor {
  constructor(private messanger: DroneMessanger) {
    super();
  }

  getSessions(): Promise<[deviceID: string, sessionID: string][]> {
    return new Promise((res, rej) => {
      res(this.messanger.activeSessions().map( session => [session.deviceID, session.id]));
    });
  }

  connect(channel: OperatorChannel, sessionID: string) {
    return new Promise<void>((res, rej) => {
      try { 
        this.messanger.connectOperator(channel, sessionID)
        res()
      }
      catch(err) {
        rej(err);
      }
    })
    
  }
}

export class NullSessionsInteractor extends SessionsInteractor {
  constructor() {
    super();
  }

  getSessions(): Promise<[deviceID: string, sessionID: string][]> {
    return Promise.resolve([]);
  }

  connect(channel: OperatorChannel, sessionID: string) {
    return Promise.reject()
  }
}
