import { EventEmitter } from 'events';
import { OperatorConnection } from './connection';
import { SessionsInteractor } from '../messanger';
import { OperatorChannel } from './channel';
import { ChannelsRouter } from './channels.router';

export class Operator extends EventEmitter {
  private connection: OperatorConnection = OperatorConnection.NULL()
  private sessionsInteractor: SessionsInteractor = SessionsInteractor.NULL()

  private channelsRouter = new ChannelsRouter(this.connection) 

  constructor() {
    super()
  }

  real() {
    return this.connection.real();
  }

  connect(connection: OperatorConnection) {
    this.connection = connection;
    this.setupConnection();
    this.channelsRouter.connect(connection);
  }

  setInteractor(interactor: SessionsInteractor) {
    this.sessionsInteractor = interactor;
  }

  private setupConnection() {
    this.connection.once('close', () => {
      this.connection = OperatorConnection.NULL()
      // TODO add correct listeners removing
    })

    this.connection.on('get_sessions', () => {
      this.sessionsInteractor.getSessions()
      .then( 
        sessions => this.connection.sendActiveSessions(sessions) 
      ).catch( err => console.log('getting sessions failed', err) );
  })

    this.connection.on('connect_to_session', message => {
      const id = message.sessionID;
      const channel = new OperatorChannel(id);

      this.sessionsInteractor.connect(channel, id)
      .then( () => {
        this.channelsRouter.add(channel);
        this.connection.sendConnectedToSession(id, true);
      } )
      .catch( err => {
        console.log('connection to session failed', err)
        this.connection.sendConnectedToSession(id, false);
      });
    })
  }
}
