import {EventEmitter} from 'events';
import {DroneChannel, SafeChannel} from './channel';

export class DroneChannelsBand extends EventEmitter implements DroneChannel {
  private channels: SafeChannel[] = [];

  constructor(...channels: SafeChannel[]) {
    super();

    channels?.forEach(channel => this.add(channel));
  }

  add(channel: SafeChannel) {
    this.setupChannel(channel);
    this.channels.push(channel);
  }

  sendMission(mission: [latitude: number, longitude: number][]): void {
    this.channels.forEach(channel => channel.sendMission(mission));
  }
  
  private setupChannel(channel: SafeChannel): void {
    const emiter = channel.emit;
    // subscribe to all events
    /* eslint-disable @typescript-eslint/no-explicit-any */
    channel.emit = (event: string | symbol, ...args: any[]): boolean => {
      this.emit(event, ...args);
      
      return emiter.apply(channel, [event, ...args]);
    }; 
  }
}