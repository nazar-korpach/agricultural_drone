import {OperatorChannel} from '@srv/operator';
import {DroneChannel} from '@srv/rts';
import {SessionInfo} from './session.info';

export class Session {
  id: string;
  deviceID: string;

  constructor(private deviceChannel: DroneChannel, private operatorChannel: OperatorChannel, id: string, deviceID: string) {
    this.id = id;
    this.deviceID = deviceID;

    this.setupDeviceChannel();
    this.setupOperatorChannel();
    console.log('created active session', id);
  }

  info(): SessionInfo {
    return {
      sessionID: this.id,
      deviceID: this.deviceID,
      status: 'active'
    };
  }

  private setupDeviceChannel() {
    this.deviceChannel.on('accepted', message => this.operatorChannel.emit('mission_started', message));
    this.deviceChannel.on('telemetry', message => this.operatorChannel.emit('telemetry', message));
    this.deviceChannel.on('soil_sample', message => this.operatorChannel.emit('soil_sample', message));
    this.deviceChannel.on('express_test', message => this.operatorChannel.emit('express_test', message));
    this.deviceChannel.on('video_frame', message => this.operatorChannel.emit('video_frame', message));
    this.deviceChannel.on('end_of_mission', message => console.log('got ', message));
  }

  private setupOperatorChannel() {
    this.operatorChannel.on('start_mission', message => {
      // TODO fix types
      this.deviceChannel.sendMission(message.coords.map( coord => [coord[0], coord[1]] ));
    });
  }
}

export class PendingSession {
  id: string;
  deviceID: string;

  constructor(private deviceChannel: DroneChannel, id: string, deviceID: string) {
    this.id = id;
    this.deviceID = deviceID;

    console.log('created pending session', id);
  }

  info(): SessionInfo {
    return {
      sessionID: this.id,
      deviceID: this.deviceID,
      status: 'online'
    };
  }

  activate(operatorChannel: OperatorChannel): Session {
    return new Session(this.deviceChannel, operatorChannel, this.id, this.deviceID);
  }
}
