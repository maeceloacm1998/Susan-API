import { EmergencyRequest } from "@/models/types/emergency.request.model";
import { EmergencyResponse } from "@/models/types/emergency.response.model";
import { EmergencyType } from "@/models/types/emergency.types.model";
import { StatusCode } from "@/models/types/status.code";
import { ChatService } from "@/services/chat.service";
import { getHospital } from "@/services/db.service";
import { Request, Response } from "express";

async function getEmergency(req: Request, res: Response) {
  const germiniChat = new ChatService();

  const { lat, lng, message }: EmergencyRequest = req.body;
  const emergencyType = await getEmergencyType(message, germiniChat);

  switch (emergencyType.trim()) {
    case EmergencyType.Hospital: {
      const hospital = await getHospital({
        lat,
        lng,
      });

      switch (hospital.status) {
        case StatusCode.Success: {
          const messageResponse = await generateHospitalResponseMessage(
            message,
            germiniChat
          );
          res.status(parseInt(StatusCode.Success)).send({
            status: StatusCode.Success,
            result: {
              message: messageResponse,
              data: hospital.result,
            } as EmergencyResponse,
          });
          break;
        }

        case StatusCode.notFound: {
          res.status(parseInt(StatusCode.notFound)).send();
          break;
        }
      }
      break;
    }

    case EmergencyType.Police: {
      // Call police service
      break;
    }

    case EmergencyType.Firefighters: {
      // Call firefighters service
      break;
    }

    case EmergencyType.Others: {
      // Call LLM to return help message
      break;
    }
  }

  // 1 Passo - Precisa do servico do chatGPT ou Germini para entender qual tipo de emergencia.
  // 2 Passo - A partir do tipo, chamar o servico especifico para cada emergencia.
  // Os Tipos sao: hospital, police, fire ou other.
  // 3 Passo - Retornar o servico mais proximo do tipo solicitado.
  // 4 Passo - OPCIONAL - Caso o servico seja other, chamar a LLM para retornar mensagem de ajuda.
}

async function getEmergencyType(
  message: string,
  chat: ChatService
): Promise<string> {
  const types = Object.values(EmergencyType);
  const responses = await chat.sendMessage(
    `What type of emergency is this? ${message}, my services are: ${types.join(
      ", "
    )}. Send only the type of emergency.`
  );
  return responses;
}

async function generateHospitalResponseMessage(
  message: string,
  chat: ChatService
): Promise<string> {
  const responses = await chat.sendMessage(
    `Preciso de uma mensagem amigavel mostrando qual especialidade ele precisa buscar e que ele precisa ir ao hospital. Baseie a resposta nessa mensagem: ${message}. No final, fale que estou recomendando um hospital mais proximo e que a baixo tem link para o Uber, google maps ou waze. Colocar mensagem generica, sem dados do hospital.  NAO COLOCAR PREFIXOS PARA SUBSTITUIR POR NOMES.`
  );
  return responses;
}

export { getEmergency };
