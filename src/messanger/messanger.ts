import { Operator } from '@srv/operator';
import {SafeChannel, RTServer, AuthMessage} from '../rts';
import { Session } from "./session";
import { RealSessionsInteractor, SessionsInteractor } from './sessions.interactor';

const randomID = () => Math.floor(Math.random() * 2**31).toString(); 

export class DroneMessanger {
  private RTServer:  RTServer
  private sessionPool: {[id: string]: Session} = {}
  private unauthPool: Set<SafeChannel> = new Set()

  constructor(RTServerPort: number, private operator: Operator) {
    this.setupOperator()

    this.RTServer = new RTServer(RTServerPort);
    this.RTServer.startServer();

    this.RTServer.on('connection', channel => {
      this.unauthPool.add(channel);

      channel.once('auth', (message: AuthMessage) => this.onAuth(channel, message) );
    })
  }

  activeSessions(): Session[] {
    return Object.values(this.sessionPool);
  }

  private setupOperator() {
    this.operator.setInteractor( new RealSessionsInteractor(this) )
  }

  private onAuth(channel: SafeChannel, message: AuthMessage) {
    this.unauthPool.delete(channel);

    const id = randomID();
    this.sessionPool[id] = new Session(channel, id, message.deviceID);
  }

}