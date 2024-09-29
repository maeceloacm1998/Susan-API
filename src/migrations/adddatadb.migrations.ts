import HospitalSchema from "@/models/schema/HospitalSchema";
import { HospitalDTO } from "@/models/types/dto/hospital.dto";
import { PlaceStatus } from "@/models/types/PlaceStatus";
import { StatusCode } from "@/models/types/status.code";

async function addHospitalData(
  data: Array<HospitalDTO>
): Promise<PlaceStatus<HospitalDTO[]>> {
  try {
    data.forEach(async (hospital) => {
      const newHospital = new HospitalSchema({
        name: hospital.name,
        address: hospital.address,
        geometry: hospital.geometry,
        phoneNumber: hospital.phoneNumber,
        location: {
          type: "Point",
          coordinates: hospital.location.coordinates,
        },
      });

      await newHospital.save();
    });

    return {
      status: StatusCode.Success,
      result: data,
    };
  } catch (error) {
    return {
      status: StatusCode.BadRequest,
      result: [] as Array<HospitalDTO>,
    };
  }
}

export { addHospitalData };
