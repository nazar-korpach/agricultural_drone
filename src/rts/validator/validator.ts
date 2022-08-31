import Ajv, {ValidateFunction} from 'ajv';
import {AuthMessage, IncomingMessage, IncomingMessageType, IncomingMessageType as Type} from '../rts-messages';
import {acceptedScheema, authSchema, endOfMisssionSchema, expressTestSchema, generalSchema, soilSampleSchema, telemetrySchema,} from './scheems';

const ajv = new Ajv();

const authValidator = ajv.compile(authSchema);
const acceptedValidator = ajv.compile(acceptedScheema);
const telemetryValidator = ajv.compile(telemetrySchema);
const soilSampleValidator = ajv.compile(soilSampleSchema);
const expressTestValidator = ajv.compile(expressTestSchema);
const endOfMissionValidator = ajv.compile(endOfMisssionSchema);

export const typeToValidator: {[type in Type]: ValidateFunction} = {
  [Type.auth]: authValidator,
  [Type.accepted]: acceptedValidator,
  [Type.telemetry]: telemetryValidator,
  [Type.soilSample]: soilSampleValidator,
  [Type.expressTest]: expressTestValidator,
  [Type.endOfMission]: endOfMissionValidator
};

export const generalValidator = ajv.compile(generalSchema);