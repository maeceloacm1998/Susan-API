import FireScheme from "@/models/schema/FireScheme";
import HospitalSchema from "@/models/schema/HospitalSchema";
import PolicyScheme from "@/models/schema/PolicyScheme";
import { FireDTO } from "@/models/types/dto/fire.dto";
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

async function addFire(data: FireDTO): Promise<PlaceStatus<FireDTO>> {
  try {
    const newFire = new FireScheme({
      name: data.name,
      address: data.address,
      geometry: data.geometry,
      phoneNumber: data.phoneNumber,
      location: data.location,
    });

    await newFire.save();

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

export async function updateFire(fireName: string, data: FireDTO) {
  try {
    await FireScheme.findOneAndUpdate({ name: fireName }, data, { new: true });
  } catch (error) {
    console.error('Error updating fire:', error);

  }
}

export { addHospitalData, addPolicy, addFire };
