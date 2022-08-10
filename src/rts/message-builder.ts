import {OutcomingMessage, OutcomingMessageType} from './rts-messages';

export class RTSMessageBuilder {
  static mission(message: [latitude: number, longitude: number][]): OutcomingMessage{
    return <OutcomingMessage> {
      type: OutcomingMessageType.missionStarted,
      timestamp: Date.now(),
      coords: message
    }
  }
}