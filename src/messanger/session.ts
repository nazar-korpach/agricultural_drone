import {SafeChannel} from '@srv/rts';
import { OperatorChannel } from '@srv/operator';

export class Session {
  id: string;
  deviceID: string;

  constructor(private deviceChannel: SafeChannel, private OperatorChannel, id: string, deviceID: string) {
    this.id = id;
    this.deviceID = deviceID;

    this.setupChannel()
    console.log('created session')

    // this.startMission([[0, 0], [1, 1], [0, 0]])

    // setInterval( () => this.startMission([[0, 0], [1, 1], [0, 0]]), 1000 )
  }

  private setupChannel() {
    this.deviceChannel.on('accepted', message => console.log('got ', message))
    this.deviceChannel.on('telemetry', message => console.log('got ', message))
    this.deviceChannel.on('soil_sample', message => console.log('got ', message))
    this.deviceChannel.on('express_test', message => console.log('got ', message))
    this.deviceChannel.on('end_of_mission', message => console.log('got ', message))
  }

  startMission(coords: [latitude: number, longitude: number][]) {
    this.deviceChannel.sendMission(coords);
  }
}

export class PendingSession {
  id: string;
  deviceID: string;

  constructor(private deviceChannel: SafeChannel, id: string, deviceID: string) {
    this.id = id;
    this.deviceID = deviceID;

    console.log('created session')
  }

  activate(operatorChannel: OperatorChannel): Session {
    return new Session(this.deviceChannel, operatorChannel, this.id, this.deviceID)
  }
}