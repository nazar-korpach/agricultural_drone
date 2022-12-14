import {EventEmitter} from 'events';
import {Server, createServer} from 'net';
import {AssemblingSocket} from '../protocol';
import {RealOperatorConnection} from './connection';
import {Operator} from './operator';

export class OperatorServer extends EventEmitter {
  private server: Server = createServer();
  
  operator: Operator = new Operator();

  constructor(port: number) {
    super();

    this.server.listen(port, () => console.log(`operearot server is running on ${port} port`));

    this.server.on('connection', socket => {
      console.log('operator got connection');
      if(this.operator.real()) {
        socket.end();
        return;
      }

      const connection = new RealOperatorConnection(new AssemblingSocket(socket) );
      connection.once('auth', message => {
        // TODO add auth logic
        console.log('operator authenticated');
        this.operator.connect(connection);
      });
    });
  } 
}
