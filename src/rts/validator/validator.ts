import {IncomingMessageType as Type, IncomingMessage, AuthMessage, IncomingMessageType} from "../rts-messages";
import {generalSchema, authSchema, acceptedScheema, telemetrySchema, mineFoundrySchema, endOfMisssionSchema, } from "./scheems";
import Ajv, {ValidateFunction} from 'ajv';

const ajv = new Ajv();

const authValidator = ajv.compile(authSchema);
const acceptedValidator = ajv.compile(acceptedScheema)
const telemetryValidator = ajv.compile(telemetrySchema)
const mineFoundValidator = ajv.compile(mineFoundrySchema)
const endOfMissionValidator = ajv.compile(endOfMisssionSchema)

export const typeToValidator: {[type in Type]: ValidateFunction} = {
  [Type.auth]: authValidator,
  [Type.accepted]: acceptedValidator,
  [Type.telemetry]: telemetryValidator,
  [Type.mineFound]: mineFoundValidator,
  [Type.endOfMission]: endOfMissionValidator
}

export const generalValidator = ajv.compile(generalSchema);