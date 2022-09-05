import {EventEmitter} from 'events';
import * as Device from '@srv/rts';
import {StartMissionMessage} from './operator.messages';

export class OperatorChannel extends EventEmitter {
  sessionID: string;
  
  constructor(id: string) {
    super();
    this.sessionID = id;
  }
}

export declare interface OperatorChannel {
  emit(event: 'start_mission', message: StartMissionMessage): boolean

  emit(event: 'telemetry', message: Device.TelemetryMessage): boolean
  emit(event: 'mission_started', message: Device.AcceptedMessage): boolean
  emit(event: 'soil_sample', message: Device.SoilSampleMessage): boolean
  emit(event: 'express_test', message: Device.ExpressTestMessage): boolean
  emit(event: 'video_frame', message: Device.VideoFrameMessage): boolean

  on(event: 'start_mission', listener: (message: StartMissionMessage) => void): this;

  on(event: 'telemetry', listener: (message: Device.TelemetryMessage) => void): this;
  on(event: 'mission_started', listener: (message: Device.AcceptedMessage) => void): this
  on(event: 'soil_sample', listener: (message: Device.SoilSampleMessage) => void): this
  on(event: 'express_test', listener: (message: Device.ExpressTestMessage) => void): this
  on(event: 'video_frame', listener: (message: Device.VideoFrameMessage) => void): this
}