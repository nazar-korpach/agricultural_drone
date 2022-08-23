import {SafeChannel} from '@srv/rts';

export class Session {
  id: string;
  deviceID: string;

  constructor(private messageChanel: SafeChannel, id: string, deviceID: string) {
    this.id = id;
    this.deviceID = deviceID;

    this.setupChannel()
    console.log('created session')

    // this.startMission([[0, 0], [1, 1], [0, 0]])

    // setInterval( () => this.startMission([[0, 0], [1, 1], [0, 0]]), 1000 )
  }

  private setupChannel() {
    this.messageChanel.on('accepted', message => console.log('got ', message))
    this.messageChanel.on('telemetry', message => console.log('got ', message))
    this.messageChanel.on('soil_sample', message => console.log('got ', message))
    this.messageChanel.on('express_test', message => console.log('got ', message))
    this.messageChanel.on('end_of_mission', message => console.log('got ', message))
  }

  startMission(coords: [latitude: number, longitude: number][]) {
    this.messageChanel.sendMission(coords);
  }
}