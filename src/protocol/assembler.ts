import {EventEmitter} from 'events';
import {Socket} from 'net';

const HEADER_LENGTH = 4;

export class AssemblingSocket extends EventEmitter {
  private buffers: Buffer[] = [];
  private bufferedLength = 0;
  private waitingLength = HEADER_LENGTH;
  private closed = false;
  private waitingHeader = true;

  constructor(private socket: Socket) {
    super();

    this.socket.on('data', data => this.recive(data))
      .once('error', err => this.onFail(err))
      .once('close', () => this.onClose(false));
  }

  send(message: string | Uint8Array) {
    const header = Buffer.allocUnsafe(HEADER_LENGTH);
    header.writeUint32BE(message.length);

    this.socket.write( Buffer.concat([header, Buffer.from(message)]) );
  }

  close() {
    this.socket.end();
  }

  private recive(data: Buffer): void {

    this.buffers.push(data);
    this.bufferedLength += data.length;

    if(this.bufferedLength >= this.waitingLength) {
      this.parseLoop();
    }
  }

  private parseLoop() {
    while(this.bufferedLength >= this.waitingLength) {
      if(this.waitingHeader === true) {
        this.waitingLength = this.readHeader();
        this.waitingHeader = false;
      }

      if(this.waitingLength > this.bufferedLength) {
        break;
      }

      const buf = this.consume(this.waitingLength);
      this.waitingLength = HEADER_LENGTH;
      this.waitingHeader = true;

      this.emit('message', buf);
    }
  }

  private consume(n: number): Buffer {
    this.bufferedLength -= n;

    if(this.buffers[0].length === n) {
      return this.buffers.shift() as Buffer;
    }

    if(this.buffers[0].length > n) {
      const buf = this.buffers[0];
      this.buffers[0] = buf.subarray(n);

      return buf.subarray(0, n);
    }

    const dist = Buffer.allocUnsafe(n);

    let toRead = n;
    let offset = 0;

    do { 

      if(this.buffers[0].length <= toRead) {
        const buf = this.buffers.shift() as Buffer;
        dist.set(buf, offset);

        offset += buf.length;
        toRead -= buf.length;
      }
      else {
        const buf = this.buffers[0];
        dist.set(buf.subarray(0, toRead), offset);

        this.buffers[0] = buf.subarray(toRead);
        
        toRead = 0;
        offset = n;
      }

    }
    while (toRead > 0);

    return dist;
  }

  private readHeader(): number {
    return this.consume(HEADER_LENGTH).readUint32BE();
  }

  private onFail(err: Error): void {
    this.emit('error', err);
    this.onClose(true);
  }

  private onClose(hasError: boolean): void {
    if(!this.closed) {
      this.emit('close', hasError);
    }
  }
}

export declare interface AssemblingSocket {
  emit(message: 'message', data: Buffer): boolean;
  emit(message: 'error', data: Error): boolean;
  emit(message: 'close', hasError: boolean): boolean;

  on(event: 'message', listener: (event: Buffer) => void): this
  once(event: 'message', listener: (event: Buffer) => void): this

  once(event: 'error', listener: (event: Error) => void): this
  once(event: 'close', listener: (event: boolean) => void): this

}