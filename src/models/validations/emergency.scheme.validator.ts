import { z } from "zod";

export const emergencySchemeValidator = z.object({
  latitude: z
    .string({
      required_error: "Latitude is required",
    })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .string({
      required_error: "Longitude is required",
    })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  range: z.string().optional(),
});
