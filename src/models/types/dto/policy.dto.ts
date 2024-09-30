import { LatLng } from "@googlemaps/google-maps-services-js";

export interface PolicyDTO {
  name?: string;
  address?: string;
  geometry?: LatLng;
  phoneNumber?: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
}
