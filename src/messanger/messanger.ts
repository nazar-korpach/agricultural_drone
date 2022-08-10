import {SafeChannel, RTServer, IncomingMessage} from '../rts';
import { Session } from "./session";

const randomID = () => Math.floor(Math.random() * 2**31); 

export class DroneMessanger {
  private RTServer:  RTServer
  private sessionPool: {[id: number]: Session} = {}
  private unauthPool: Set<SafeChannel> = new Set()

  constructor(RTServerPort: number) {
    this.RTServer = new RTServer(RTServerPort);
    this.RTServer.startServer();

    this.RTServer.on('connection', channel => {
      this.unauthPool.add(channel);

      channel.once('auth', (message: IncomingMessage) => this.onAuth(channel, message) );
    })
  }

  private onAuth(channel: SafeChannel, message: IncomingMessage) {
    this.unauthPool.delete(channel);

    const id = randomID();
    this.sessionPool[id] = new Session(channel);
  }

}