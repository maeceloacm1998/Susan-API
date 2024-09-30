import { EmergencyObjects } from "@/models/types/emergency.response.model";
import { PlaceStatus } from "@/models/types/PlaceStatus";
import { StatusCode } from "@/models/types/status.code";
import hospitalSchema from "@models/schema/HospitalSchema";
import policySchema from "@models/schema/PolicyScheme";

/**
 * Exemplo de como pegar o dado na api e filtrar os hospitais por distancia.
 *
 */
async function getHospital({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<PlaceStatus<EmergencyObjects>> {
  try {
    const hospital = await hospitalSchema.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: 100000,
          spherical: true,
        },
      },
    ]);

    return {
      status: StatusCode.Success,
      result: {
        name: hospital[0].name,
        distance: hospital[0].distance,
        phoneNumber: hospital[0].phoneNumber,
        address: hospital[0].address,
        lat: hospital[0].location.coordinates[1],
        lng: hospital[0].location.coordinates[0],
      },
    };
  } catch (e) {
    console.error(e);
    return {
      status: StatusCode.notFound,
      result: [] as any,
    };
  }
}

async function getPolicy({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<PlaceStatus<EmergencyObjects>> {
  try {
    const policy = await policySchema.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: 100000,
          spherical: true,
        },
      },
    ]);

    return {
      status: StatusCode.Success,
      result: {
        name: policy[0].name,
        distance: policy[0].distance,
        phoneNumber: policy[0].phoneNumber,
        address: policy[0].address,
        lat: policy[0].location.coordinates[1],
        lng: policy[0].location.coordinates[0],
      },
    };
  } catch (e) {
    console.error(e);
    return {
      status: StatusCode.notFound,
      result: [] as any,
    };
  }
}

export { getHospital, getPolicy };
