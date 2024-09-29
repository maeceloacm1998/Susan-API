import { StatusCode } from "@/models/types/status.code";
import { getHospital } from "@/services/db.service";
import { Request, Response } from "express";

async function getEmergency(req: Request, res: Response) {
  const lat = Number(req.query.latitude);
  const lng = Number(req.query.longitude);

  // const message = String(req.query.message);

  // 1 Passo - Precisa do servico do chatGPT ou Germini para entender qual tipo de emergencia.
  // 2 Passo - A partir do tipo, chamar o servico especifico para cada emergencia.
  // Os Tipos sao: hospital, police, fire ou other.
  // 3 Passo - Retornar o servico mais proximo do tipo solicitado.
  // 4 Passo - OPCIONAL - Caso o servico seja other, chamar a LLM para retornar mensagem de ajuda.


  // Exemplo de chamada para o servico de hospital
  const hospitalsList = await getHospital({
    lat,
    lng,
  });

  switch (hospitalsList.status) {
    case StatusCode.Success: {
      res.status(parseInt(StatusCode.Success)).send({
        status: StatusCode.Success,
        result: [],
      });
      break;
    }

    case StatusCode.notFound: {
      res.status(parseInt(StatusCode.notFound)).send();
      break;
    }
  }
}

export { getEmergency };
