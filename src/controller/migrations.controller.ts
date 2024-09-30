import { addHospitalData, addPolicy } from "@/migrations/adddatadb.migrations";
import { HospitalDTO } from "@/models/types/dto/hospital.dto";
import { StatusCode } from "@/models/types/status.code";
import {
  placeAutoComplete,
  placeHospitalDetails,
} from "@/services/maps.service";
import { LatLngLiteral } from "@googlemaps/google-maps-services-js";
import { Request, Response } from "express";

async function getHospitalMigrations(req: Request, res: Response) {
  const hospitaList: Array<HospitalDTO> = req.body;

  const response = await addHospitalData(hospitaList);

  switch (response.status) {
    case StatusCode.Success: {
      res.status(parseInt(StatusCode.Success)).send({
        status: StatusCode.Success,
        result: response.result,
      });
      break;
    }

    case StatusCode.notFound: {
      res.status(parseInt(StatusCode.notFound)).send();
      break;
    }
  }
}

interface PolicyTemporary {
  orgao_responsavel: string;
  phone: string;
  address: string;
}

async function getPolicyMigrations(req: Request, res: Response) {
  const policy: Array<PolicyTemporary> = req.body;

  policy.forEach(async (pol) => {
    const getLatLong = await placeAutoComplete(pol.address);

    if (getLatLong.result[0]) {
      const getMapsDetails = await placeHospitalDetails(
        getLatLong.result[0].place_id
      );

      if (!getMapsDetails.result.result.geometry) {
        return res
          .status(parseInt(StatusCode.notFound))
          .send({ error: "Geometry not found" });
      }
      const latlng: LatLngLiteral =
        getMapsDetails.result.result.geometry.location;

      await addPolicy({
        name: pol.orgao_responsavel,
        address: pol.address,
        phoneNumber: pol.phone,
        geometry: {
          lat: latlng.lat,
          lng: latlng.lng,
        },
        location: {
          type: "Point",
          coordinates: [latlng.lng, latlng.lat],
        },
      });
    }
  });
}

export { getHospitalMigrations, getPolicyMigrations };
