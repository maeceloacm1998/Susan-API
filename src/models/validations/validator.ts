import { validate } from "@middlewares/validate";
import { emergencySchemeValidator } from "./emergency.scheme.validator";

export const validateEmergency = validate(emergencySchemeValidator);