export interface SessionInfo {
  sessionID: string
  deviceID: string
  status: 'active' | 'online' | 'offline'
}