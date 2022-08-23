import {DroneMessanger} from './messanger';
import {OperatorServer} from './operator';

(async () => {
  const opratorServer = new OperatorServer(3001);

  const operator = opratorServer.operator

  const server = new DroneMessanger(3000, operator);
} )()