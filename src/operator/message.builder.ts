import {ActiveSessionsMessage, ConnectedToSessionMessage, OutcomingMessageType} from './operator.messages';

export class OperatorMessageBuilder {
  static activeSessions(sessions: [deviveID: string, sessionID: string][]): ActiveSessionsMessage {
    return {
      type: OutcomingMessageType.activeSessions,
      timestamp: Date.now(),
      sessions
    }
  }

  static connectedToSession(sessionID: string, succeed: boolean): ConnectedToSessionMessage {
    return {
      type: OutcomingMessageType.connectedToSession,
      timestamp: Date.now(),
      sessionID,
      connected: succeed
    }
  }
}
