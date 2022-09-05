import {ActiveSessionsMessage, ConnectedToSessionMessage, ExpressTestMessage, MissionStartedMessage, OutcomingMessageType, SoilSampleMessage, TelemetryMessage, VideoFrameMessage} from './operator.messages';

export class OperatorMessageBuilder {
  static activeSessions(sessions: [deviveID: string, sessionID: string][]): ActiveSessionsMessage {
    return {
      type: OutcomingMessageType.activeSessions,
      timestamp: Date.now(),
      sessions
    };
  }

  static connectedToSession(sessionID: string, succeed: boolean): ConnectedToSessionMessage {
    return {
      type: OutcomingMessageType.connectedToSession,
      timestamp: Date.now(),
      sessionID,
      connected: succeed
    };
  }

  static missionStarted(sessionID: string, accepted: boolean): MissionStartedMessage {
    return {
      type: OutcomingMessageType.missionStarted,
      timestamp: Date.now(),
      sessionID,
      accepted
    };
  }

  static telemetry(sessionID, latitude: number, longitude: number, compass: number): TelemetryMessage {
    return {
      type: OutcomingMessageType.telemetry,
      timestamp: Date.now(),
      sessionID,
      latitude,
      longitude,
      compass
    };
  }

  static soilSample(sessionID: string, latitude: number, longitude: number): SoilSampleMessage {
    return {
      type: OutcomingMessageType.soilSample,
      timestamp: Date.now(),
      sessionID,
      latitude,
      longitude
    };
  }

  static expressTest(sessionID, latitude: number, longitude: number, temperature: number, humidity: number, ph: number): ExpressTestMessage {
    return {
      type: OutcomingMessageType.expressTest,
      timestamp: Date.now(),
      sessionID,
      latitude,
      longitude,
      temperature,
      humidity,
      ph
    };
  }

  static videoFrame(sessionID: string, width: number, height: number, frame: string): VideoFrameMessage {
    return {
      type: OutcomingMessageType.videoFrame,
      timestamp: Date.now(),
      sessionID,
      width,
      height,
      frame
    };
  }
}
