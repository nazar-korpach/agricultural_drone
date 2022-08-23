import { DroneMessanger } from './messanger';

export abstract class SessionsInteractor {
  abstract getSessions(): Promise<[deviceID: string, sessionID: string][]> 

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
}

export class NullSessionsInteractor extends SessionsInteractor {
  constructor() {
    super();
  }

  getSessions(): Promise<[deviceID: string, sessionID: string][]> {
    return Promise.resolve([]);
  }
}
