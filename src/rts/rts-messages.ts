export enum IncomingMessageType {
  auth = 'init_message',
  accepted = 'coords_accepted',
  telemetry = 'common_telemetry',
  endOfMission = 'end_of_mission',
  soilSample = 'soil_sample',
  expressTest = 'express_test',
  videoFrame = 'video_frame'
}

export enum OutcomingMessageType {
  missionStarted = 'coords',
  invalid = 'invalid_message'
}

export interface RTSMessage {
  type: IncomingMessageType | OutcomingMessageType
  timestamp: number
}

export interface IncomingMessage extends RTSMessage {
  type: IncomingMessageType
}

export interface OutcomingMessage extends RTSMessage {
  type: OutcomingMessageType
}

export interface AuthMessage extends IncomingMessage {
  type: IncomingMessageType.auth
  deviceID: string 
  latitude: number
  longitude: number
}

export interface AcceptedMessage extends IncomingMessage {
  type: IncomingMessageType.accepted
  accepted: boolean
}

export interface TelemetryMessage extends IncomingMessage {
  type: IncomingMessageType.telemetry
  latitude: number
  longitude: number
  compass: number
}

export interface SoilSampleMessage extends IncomingMessage {
  type: IncomingMessageType.soilSample
  timestamp: number
  latitude: number
  longitude: number
}

export interface ExpressTestMessage extends IncomingMessage {
  type: IncomingMessageType.expressTest
  timestamp: number
  latitude: number
  longitude: number
  temperature: number
  humidity: number
  ph: number
}

export interface VideoFrameMessage extends IncomingMessage {
  type: IncomingMessageType.videoFrame
  width: number
  height: number
  frame: string
}

export interface EndMessage extends IncomingMessage {
  type: IncomingMessageType.endOfMission
}

export interface MissionSetupMessage extends OutcomingMessage {
  type: OutcomingMessageType.missionStarted
  coords: [latitude: number, longitude: number][]
}

export interface InvalidMessage extends OutcomingMessage {
  type: OutcomingMessageType.invalid
  originalMessage: string
  reason: string
}