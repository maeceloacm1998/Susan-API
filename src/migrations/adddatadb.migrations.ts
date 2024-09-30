import HospitalSchema from "@/models/schema/HospitalSchema";
import PolicyScheme from "@/models/schema/PolicyScheme";
import { HospitalDTO } from "@/models/types/dto/hospital.dto";
import { PolicyDTO } from "@/models/types/dto/policy.dto";
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
        location: hospital.location,
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

async function addPolicy(data: PolicyDTO): Promise<PlaceStatus<PolicyDTO>> {
  try {
    const newPolicy = new PolicyScheme({
      name: data.name,
      address: data.address,
      geometry: data.geometry,
      phoneNumber: data.phoneNumber,
      location: data.location,
    });

    await newPolicy.save();

    return {
      status: StatusCode.Success,
      result: data,
    };
  } catch (error) {
    return {
      status: StatusCode.BadRequest,
      result: {} as PolicyDTO,
    };
  }
}

export { addHospitalData, addPolicy };
