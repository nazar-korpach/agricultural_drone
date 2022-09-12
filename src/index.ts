import * as dotenv from 'dotenv';
dotenv.config();

import * as configs from './configs';
import {DroneMessanger} from './messanger';
import {OperatorServer} from './operator';
import {DroneServer} from './rts';

(async () => {
  const opratorServer = new OperatorServer(configs.OPERATOR_PORT);
  const droneServer = new DroneServer(configs.DRONE_PORT);

  const operator = opratorServer.operator;

  const server = new DroneMessanger(droneServer, operator);
} )();