import {IncomingMessageType as Type, IncomingMessage, AuthMessage, AcceptedMessage, TelemetryMessage, MineFoundMessage, EndMessage} from "../rts-messages";
import {JSONSchemaType} from 'ajv';

export const authSchema: JSONSchemaType<AuthMessage> = {
  type: 'object',
  properties: {
    type: { type: 'string', const: Type.auth},
    deviceID: {type: 'string'},
    timestamp: {type: 'number'}
    
  },
  required: ['deviceID', 'type', 'timestamp'],
  additionalProperties: false
}

export const acceptedScheema: JSONSchemaType<AcceptedMessage> = {
  type: 'object',
  properties: {
    type: { type: 'string', const: Type.accepted},
    timestamp: {type: 'number'},
    accepted: {type: 'boolean'}
  },
  required: ['accepted', 'type', 'timestamp'],
  additionalProperties: false
}

export const telemetrySchema: JSONSchemaType<TelemetryMessage> = {
  type: 'object',
  properties: {
    type: { type: 'string', const: Type.telemetry},
    timestamp: {type: 'number'},
    latitude: {type: 'number'},
    longitude: {type: 'number'}
  },
  required: ['latitude', 'longitude', 'type', 'timestamp'],
  additionalProperties: false
}

export const mineFoundrySchema: JSONSchemaType<MineFoundMessage> = {
  type: 'object',
  properties: {
    type: { type: 'string', const: Type.mineFound},
    timestamp: {type: 'number'},
    latitude: {type: 'number'},
    longitude: {type: 'number'}
  },
  required: ['latitude', 'longitude', 'type', 'timestamp'],
  additionalProperties: false
}

export const endOfMisssionSchema: JSONSchemaType<EndMessage> = {
  type: 'object',
  properties: {
    type: { type: 'string', const: Type.endOfMission},
    timestamp: {type: 'number'},
  },
  required: ['type', 'timestamp'],
  additionalProperties: false
}

export const generalSchema: JSONSchemaType<IncomingMessage> = {
  type: 'object',
  properties: {
    type: {type: 'string', enum: Object.values(Type)},
    timestamp: {type: 'number'}
  },
  required: ['type', 'timestamp'],
  additionalProperties: true
}