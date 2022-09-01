import * as dotenv from 'dotenv';
dotenv.config();

import * as configs from './configs';
import {DroneMessanger} from './messanger';
import {OperatorServer} from './operator';

(async () => {
  const opratorServer = new OperatorServer(configs.OPERATOR_PORT);

  const operator = opratorServer.operator;

  const server = new DroneMessanger(configs.DRONE_PORT, operator);
} )();