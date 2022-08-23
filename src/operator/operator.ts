import { EventEmitter } from 'events';
import { OperatorConnection } from './connection';
import { SessionsInteractor } from '../messanger';

export class Operator extends EventEmitter {
  private connection: OperatorConnection = OperatorConnection.NULL()
  private sessionsInteractor: SessionsInteractor = SessionsInteractor.NULL()

  constructor() {
    super()
  }

  real() {
    return this.connection.real();
  }

  connect(connection: OperatorConnection) {
    this.connection = connection;
    this.setupConnection();
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

    this.connection.on('connect_to_session', () => {})
  }
}