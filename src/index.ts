import * as dotenv from 'dotenv';
import * as configs from './configs';
import {DroneMessanger} from './messanger';
import {OperatorServer} from './operator';

(async () => {
  dotenv.config();

  const opratorServer = new OperatorServer(configs.OPERATOR_PORT);

  const operator = opratorServer.operator;

  const server = new DroneMessanger(configs.DEVICE_PORT, operator);
} )();