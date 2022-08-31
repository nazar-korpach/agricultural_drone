import {EventEmitter} from 'events';
import {Server, createServer} from 'net';
import {SafeChannel} from './channel';

export declare interface RTServer {
  emit(event: 'connection', chanel: SafeChannel): boolean;

  on(event: 'connection', listener: (chanel: SafeChannel) => void): this;
}

export class RTServer extends EventEmitter {
  private srv: Server = createServer();

  constructor(private port: number) {
    super();
  }

  startServer() {
    this.srv.listen(this.port, () => console.log('tcp server is running'));

    this.srv.on('connection', socket => {
      console.log('connected');
      const channel = new SafeChannel(socket);
      this.emit('connection', channel);
    });
  }

  
}