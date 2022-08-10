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