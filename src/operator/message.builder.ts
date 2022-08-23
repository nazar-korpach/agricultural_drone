import {ActiveSessionsMessage, OutcomingMessageType} from './operator.messages';

export class OperatorMessageBuilder {
  static activeSessions(sessions: [deviveID: string, sessionID: string][]): ActiveSessionsMessage {
    return {
      type: OutcomingMessageType.activeSessions,
      timestamp: Date.now(),
      sessions
    }
  }
}
