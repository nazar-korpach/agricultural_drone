export enum IncomingMessageType {
  auth = 'auth',
  activeSessions = 'get_sessions',
  connectToSession = 'connect_to_session',
  startMission = 'start_mission'
}

export enum OutcomingMessageType {
  activeSessions = 'active_sessions',
  connectedToSession = 'connected_to_session',
  missionStarted = 'mission_recived',
  telemetry = 'common_telemetry',
  soilSample = 'soil_sample',
  expressTest = 'express_test',
  videoFrame = 'video_frame'
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

export interface StartMissionMessage extends IncomingMessage {
  type: IncomingMessageType.startMission,
  sessionID: string,
  coords: [latitude: number, longitude: number, action: number][]
}

export interface ActiveSessionsMessage extends OutcomingMessage {
  type: OutcomingMessageType.activeSessions
  sessions: {
    sessionID: string
    deviceID: string
    status: 'active' | 'online' | 'offline'
  }[],
}

export interface ConnectedToSessionMessage extends OutcomingMessage {
  type: OutcomingMessageType.connectedToSession
  sessionID: string
  connected: boolean 
}

export interface MissionStartedMessage extends OutcomingMessage {
  type: OutcomingMessageType.missionStarted
  sessionID: string
  accepted: boolean
}

export interface TelemetryMessage extends OutcomingMessage {
  type: OutcomingMessageType.telemetry,
  sessionID: string
  latitude: number
  longitude: number
  compass: number
}

export interface SoilSampleMessage extends OutcomingMessage {
  type: OutcomingMessageType.soilSample,
  sessionID: string
  latitude: number
  longitude: number
}

export interface ExpressTestMessage extends OutcomingMessage {
  type: OutcomingMessageType.expressTest,
  sessionID: string
  latitude: number
  longitude: number
  temperature: number
  humidity: number
  ph: number
}

export interface VideoFrameMessage extends OutcomingMessage {
  type: OutcomingMessageType.videoFrame
  sessionID: string
  width: number
  height: number
  frame: string
}