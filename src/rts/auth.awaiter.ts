import {DroneChannel} from './channel';
import {AuthMessage} from './rts-messages';

const MAX_AUTH_WAIT_TIME = 6 * 1000;

export interface Authable<M> {
  on(message: 'auth', listener: (message: M) => void): this;

  close(): void;
}

export class AuthAwaiter<Channel extends Authable<Message>, Message = any> {
  private channels: Set<Channel> = new Set();
  private cancelers: Map<Channel, NodeJS.Timer> = new Map();

  constructor(private cb: (channel: Channel, message: Message) => void) {}

  wait(channel: Channel) {
    this.channels.add(channel);

    this.scheduleCancel(channel, MAX_AUTH_WAIT_TIME);

    channel.on('auth', message => {
      this.revokeCancel(channel);

      this.cb(channel, message);
    });
  }

  clear() {
    this.channels.forEach(channel => this.revokeCancel(channel));

    this.channels.forEach(channel => channel.close());
  }

  private scheduleCancel(channel: Channel, time: number) {
    const timeout = setTimeout(() => {
      channel.close();
    }, time);

    this.cancelers.set(channel, timeout);
  }

  private revokeCancel(channel: Channel) {
    if(this.cancelers.has(channel)) {
      this.cancelers.delete(channel);
    }
    else console.warn('deleting unexisting channel in UnauthPool');
  }
}