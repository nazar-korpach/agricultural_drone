import { OperatorChannel } from "./channel";
import { OperatorConnection } from "./connection";

export class ChannelsRouter {
  private channelsPool: Map<string, OperatorChannel> = new Map();

  constructor(private connection: OperatorConnection) {
    this.setupConnection(connection);
  }

  connect(connection: OperatorConnection) {
    this.connection = connection;
    this.setupConnection(connection); 
  }

  add(channel: OperatorChannel) {
    const id = channel.sessionID;
    this.channelsPool.set(id, channel);
    this.setupChannel(channel);
  }

  private setupChannel(channel: OperatorChannel) {
    channel.on('telemetry', message => {
      this.connection.sendTelemetry(
        channel.sessionID,
        message.latitude,
        message.longitude,
        message.compass
      )
    });

    channel.on('mission_started', message => {
      this.connection.sendMissionStarted(
        channel.sessionID,
        message.accepted
      )
    })

    channel.on('soil_sample', message => {
      this.connection.sendSoilSample(
        channel.sessionID,
        message.latitude,
        message.longitude
      )
    })

    channel.on('express_test', message => {
      this.connection.sendExpressTest(
        channel.sessionID,
        message.latitude,
        message.longitude,
        message.temperature,
        message.humidity,
        message.ph   
      )
    })
  }

  private setupConnection(connection: OperatorConnection) {
    connection.on('start_mission', message => {
      console.log('router; got start_mission');
      const id = message.sessionID;

      if(!this.channelsPool.has(id)) {
        console.log('router; invalid session id');
        return;
      }

      this.channelsPool.get(id)?.emit('start_mission', message)
    })
  }
}