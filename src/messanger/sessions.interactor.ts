import {OperatorChannel} from '@srv/operator';
import {DroneMessanger} from './messanger';
import { SessionInfo } from './session.info';

export abstract class SessionsInteractor {
  abstract getSessions(): Promise<SessionInfo[]>; 

  abstract connect(channel: OperatorChannel, sessionID: string): Promise<void>;

  static NULL() {
    return new NullSessionsInteractor();
  }
}

export class RealSessionsInteractor extends SessionsInteractor {
  constructor(private messanger: DroneMessanger) {
    super();
  }

  getSessions(): Promise<SessionInfo[]> {
    return new Promise((res, rej) => {
      res(this.messanger.activeSessions());
    });
  }

  connect(channel: OperatorChannel, sessionID: string) {
    return new Promise<void>((res, rej) => {
      try { 
        this.messanger.connectOperator(channel, sessionID);
        res();
      }
      catch(err) {
        rej(err);
      }
    });
    
  }
}

export class NullSessionsInteractor extends SessionsInteractor {
  constructor() {
    super();
  }
  /* eslint-disable */
  getSessions(): Promise<SessionInfo[]> {
    return Promise.resolve([]);
  }

  connect(channel: OperatorChannel, sessionID: string) {
    return Promise.reject();
  }
  /* eslint-enable */
}
