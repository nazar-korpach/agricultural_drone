import {InvalidMessage, MissionSetupMessage, OutcomingMessageType} from './rts-messages';

export class RTSMessageBuilder {
  static mission(message: [latitude: number, longitude: number][]): MissionSetupMessage {
    return {
      type: OutcomingMessageType.missionStarted,
      timestamp: Date.now(),
      coords: message
    };
  }

  static invalid(originalMessage: string, reason: string): InvalidMessage {
    return {
      type: OutcomingMessageType.invalid,
      timestamp: Date.now(),
      originalMessage,
      reason
    };
  }
}