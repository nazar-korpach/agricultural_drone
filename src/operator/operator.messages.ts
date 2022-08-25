export enum IncomingMessageType  {
  auth = 'auth',
  activeSessions = 'get_sessions',
  connectToSession = 'connect_to_session'
}

export enum OutcomingMessageType {
  activeSessions = 'active_sessions',
  connectedToSession = 'connected_to_session'
}

export interface OperatorMessage {
  type: IncomingMessageType | OutcomingMessageType
  timestamp: number
}

export interface IncomingMessage extends OperatorMessage {
  type: IncomingMessageType
}

export interface OutcomingMessage extends OperatorMessage {
  type: OutcomingMessageType
}

export interface AuthMessage extends IncomingMessage {
  type: IncomingMessageType.auth
  version: string
  secret: string
}

export interface GetSessionsMessage extends IncomingMessage {
  type: IncomingMessageType.activeSessions
}

export interface ConnectSessionMessage extends IncomingMessage {
  type: IncomingMessageType.connectToSession
  sessionID: string
}

export interface ActiveSessionsMessage extends OutcomingMessage {
  type: OutcomingMessageType.activeSessions
  sessions: [deviveID:  string, sessionID: string][]
}

export interface ConnectedToSessionMessage extends OutcomingMessage {
  type: OutcomingMessageType.connectedToSession
  sessionID: string
  connected: boolean 
}