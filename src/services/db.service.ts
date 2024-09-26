import { PlaceStatus } from "@/models/types/PlaceStatus";
import { StatusCode } from "@/models/types/status.code";
import hospitalSchema from "@models/schema/HospitalSchema";

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
}): Promise<PlaceStatus<any>> {
  try {
    const hospitalList = await hospitalSchema.aggregate([
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
      result: hospitalList,
    };
  } catch (e) {
    return {
      status: StatusCode.notFound,
      result: [] as any,
    };
  }
}

export { getHospital };
