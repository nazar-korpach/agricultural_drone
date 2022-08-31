import ajv, {JSONSchemaType} from 'ajv';
import {AuthMessage, ConnectSessionMessage, GetSessionsMessage, IncomingMessage, IncomingMessageType, StartMissionMessage} from '../operator.messages';

export const partialShema: JSONSchemaType<IncomingMessage> = {
  type: 'object',
  properties: {
    type: {type: 'string', enum: Object.values(IncomingMessageType)},
    timestamp: {type: 'number'}
  },
  required: ['type', 'timestamp'],
  additionalProperties: true
};

export const authShema: JSONSchemaType<AuthMessage> = {
  type: 'object',
  properties: {
    type: {type: 'string', const: IncomingMessageType.auth},
    timestamp: {type: 'number'},
    version: {type: 'string'},
    secret: {type: 'string'}
  },
  required: ['type', 'timestamp', 'version', 'secret'],
  additionalProperties: false
};

export const getSessionsSchema: JSONSchemaType<GetSessionsMessage> = {
  type: 'object',
  properties: {
    type: {type: 'string', const: IncomingMessageType.activeSessions},
    timestamp: {type: 'number'}
  },
  required: ['type', 'timestamp'],
  additionalProperties: false
};

export const connectSessionsSchema: JSONSchemaType<ConnectSessionMessage> = {
  type: 'object',
  properties: {
    type: {type: 'string', const: IncomingMessageType.connectToSession},
    timestamp: {type: 'number'},
    sessionID: {type: 'string'}
  },
  required: ['type', 'timestamp', 'sessionID'],
  additionalProperties: false
};

export const startMissionSchema: JSONSchemaType<StartMissionMessage> = {
  type: 'object',
  properties: {
    type: {type: 'string', const: IncomingMessageType.startMission},
    timestamp: {type: 'number'},
    sessionID: {type: 'string'},
    coords: {
      type: 'array',
      items: {
        type: 'array',
        items: [{type: 'number'}, {type: 'number'}, {type: 'number'}],
        minItems: 3, maxItems: 3
      }
    },
  },
  required: ['type', 'timestamp', 'sessionID', 'coords'],
  additionalProperties: false
};
