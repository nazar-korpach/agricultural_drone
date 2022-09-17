import {EventEmitter} from 'events';
import {DroneChannel} from './channel';

export class DroneChannelsBand extends EventEmitter implements DroneChannel {
  private channels: DroneChannel[] = [];

  constructor(...channels: DroneChannel[]) {
    super();

    channels?.forEach(channel => this.add(channel));
  }

  add(channel: DroneChannel) {
    this.setupChannel(channel);
    this.channels.push(channel);
  }

  sendMission(mission: [latitude: number, longitude: number][]): void {
    this.channels.forEach(channel => channel.sendMission(mission));
  }

  close(): void {
    this.channels.forEach(channel => channel.close());
  }
  
  private setupChannel(channel: DroneChannel): void {
    const emiter = channel.emit;
    // subscribe to all events
    /* eslint-disable @typescript-eslint/no-explicit-any */
    channel.emit = (event: string | symbol, ...args: any[]): boolean => {
      this.emit(event, ...args);
      
      return emiter.apply(channel, [event, ...args]);
    }; 
  }
}