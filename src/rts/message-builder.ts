import {MissionSetupMessage, OutcomingMessageType} from './rts-messages';

export class RTSMessageBuilder {
  static mission(message: [latitude: number, longitude: number][]): MissionSetupMessage{
    return {
      type: OutcomingMessageType.missionStarted,
      timestamp: Date.now(),
      coords: message
    }
  }
}