import {SafeChannel} from '@srv/rts';

export class Session {
  constructor(private messageChanel: SafeChannel) {
    this.setupChannel()
    console.log('created session')

    this.startMission([[0, 0], [1, 1], [0, 0]])
  }

  private setupChannel() {
    this.messageChanel.on('mine_found', message => console.log('got ', message))
    this.messageChanel.on('accepted', message => console.log('got ', message))
    this.messageChanel.on('telemetry', message => console.log('got ', message))
    this.messageChanel.on('end_of_mission', message => console.log('got ', message))
  }

  startMission(coords: [latitude: number, longitude: number][]) {
    this.messageChanel.sendMission(coords);
  }
}