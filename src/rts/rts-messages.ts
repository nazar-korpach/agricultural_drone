export enum IncomingMessageType {
  auth = 'init_message',
  accepted = 'coords_accepted',
  telemetry = 'common_telemetry',
  mineFound = 'volnurable_spot',
  endOfMission = 'end_of_mission'
}

export enum OutcomingMessageType {
  missionStarted = 'coords'
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
}

export interface AcceptedMessage extends IncomingMessage {
  type: IncomingMessageType.accepted
  accepted: boolean
}

export interface TelemetryMessage extends IncomingMessage {
  type: IncomingMessageType.telemetry
  latitude: number
  longitude: number
}

export interface MineFoundMessage extends IncomingMessage {
  type: IncomingMessageType.mineFound
  latitude: number
  longitude: number
}

export interface EndMessage extends IncomingMessage {
  type: IncomingMessageType.endOfMission
}

export interface MissionSetupMessage extends OutcomingMessage {
  type: OutcomingMessageType.missionStarted
  coords: [latitude: number, longitude: number][]
}