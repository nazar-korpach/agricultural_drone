import {IncomingMessageType as Type, IncomingMessage, AuthMessage, AcceptedMessage, TelemetryMessage, EndMessage, SoilSampleMessage, ExpressTestMessage} from "../rts-messages";
import {JSONSchemaType} from 'ajv';

export const authSchema: JSONSchemaType<AuthMessage> = {
  type: 'object',
  properties: {
    type: { type: 'string', const: Type.auth},
    deviceID: {type: 'string'},
    timestamp: {type: 'number'},
    latitude: {type: 'number'},
    longitude: {type: 'number'}
    
  },
  required: ['deviceID', 'type', 'timestamp', 'latitude', 'longitude'],
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
    longitude: {type: 'number'},
    compass: {type: 'number'}
  },
  required: ['latitude', 'longitude', 'compass', 'type', 'timestamp'],
  additionalProperties: false
}

export const soilSampleSchema: JSONSchemaType<SoilSampleMessage> = {
  type: 'object',
  properties: {
    type: {type: 'string', const: Type.soilSample},
    timestamp: {type: 'number'},
    latitude: {type: 'number'},
    longitude: {type: 'number'},
  },
  required: ['type', 'timestamp', 'latitude', 'longitude'],
  additionalProperties: false
}

export const expressTestSchema: JSONSchemaType<ExpressTestMessage> = {
  type: 'object',
  properties: {
    type: {type: 'string', const: Type.expressTest},
    timestamp: {type: 'number'},
    latitude: {type: 'number'},
    longitude: {type: 'number'},
    temperature: {type: 'number'},
    humidity: {type: 'number'},
    ph: {type: 'number'}
  },
  required: ['type', 'timestamp', 'latitude', 'longitude', 'temperature', 'humidity', 'ph'],
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