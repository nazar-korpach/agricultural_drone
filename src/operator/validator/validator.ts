import Ajv, {ValidateFunction} from 'ajv';
import {AuthMessage, ConnectSessionMessage, GetSessionsMessage, IncomingMessage, StartMissionMessage, IncomingMessageType as Type} from '../operator.messages';
import {authShema, connectSessionsSchema, getSessionsSchema, partialShema, startMissionSchema} from './schems';

const ajv = new Ajv();

export const partialValidator: ValidateFunction<IncomingMessage> = ajv.compile(partialShema);
const authValidator: ValidateFunction<AuthMessage> = ajv.compile(authShema);
const getSessionsValidator: ValidateFunction<GetSessionsMessage> = ajv.compile(getSessionsSchema);
const connectSessionsValidator: ValidateFunction<ConnectSessionMessage> = ajv.compile(connectSessionsSchema);
const startMissionValidator: ValidateFunction<StartMissionMessage> = ajv.compile(startMissionSchema);

export const typeToValidator: {[id in Type]: ValidateFunction} = {
  [Type.auth]: authValidator,
  [Type.activeSessions]: getSessionsValidator,
  [Type.connectToSession]: connectSessionsValidator,
  [Type.startMission]: startMissionValidator
};
