import { addHospitalData } from "@/migrations/adddatadb.migrations";
import { HospitalDTO } from "@/models/types/dto/hospital.dto";
import { StatusCode } from "@/models/types/status.code";
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

export { getHospitalMigrations };
