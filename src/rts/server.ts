import {EventEmitter} from 'events';
import {Server, createServer} from 'net';
import {AssemblingSocket} from '../protocol';
import {DroneChannel, SafeChannel} from './channel';
import {DroneChannelsBand} from './channel.band';
import {AuthMessage} from './rts-messages';

export declare interface DroneServer {
  emit(event: 'connection', chanel: DroneChannel): boolean;
  emit(event: 'auth', chanel: DroneChannel, message: AuthMessage): boolean;
  emit(event: 'error', error: Error): boolean;

  on(event: 'connection', listener: (chanel: DroneChannel) => void): this;
  on(event: 'auth', listener: (chanel: DroneChannel, message: AuthMessage) => void): this;
  once(event: 'error', listener: (error: Error) => void): this
}

export class DroneServer extends EventEmitter {
  private bandsPool: {[deviceID: string]: DroneChannelsBand} = {};
  private unauthPool: Set<SafeChannel> = new Set();
  private srv: Server = createServer();

  constructor(private port: number) {
    super();

    this.startServer();
  }

  startServer() {
    this.srv.listen(this.port, () => console.log(`drone serve is running on ${this.port} port`));

    this.srv.on('connection', socket => {
      console.log('drone connected');

      const channel = new SafeChannel(new AssemblingSocket(socket));
      this.unauthPool.add(channel);

      channel.on('auth', message => this.onAuth(channel, message));

      this.emit('connection', channel);
    });

    this.srv.on('error', error => this.emit('error', error));
  }

  private onAuth(channel: SafeChannel, message: AuthMessage) {
    console.log('drone authed');
    // TODO add auth logic
    this.unauthPool.delete(channel);

    const id = message.deviceID;
    if(this.bandsPool[id] !== undefined) {
      this.bandsPool[id].add(channel);
    }
    else {
      this.bandsPool[id] = new DroneChannelsBand(channel);
      this.emit('auth', this.bandsPool[id], message);
    }
  }
}