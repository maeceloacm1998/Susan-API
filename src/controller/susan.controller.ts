import { EmergencyRequest } from "@/models/types/emergency.request.model";
import { EmergencyResponse } from "@/models/types/emergency.response.model";
import { EmergencyType } from "@/models/types/emergency.types.model";
import { StatusCode } from "@/models/types/status.code";
import { ChatService } from "@/services/chat.service";
import { getFire, getHospital, getPolicy } from "@/services/db.service";
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
      const policy = await getPolicy({
        lat,
        lng,
      });

      switch (policy.status) {
        case StatusCode.Success: {
          const messageResponse = await generatePolicyResponseMessage(
            message,
            germiniChat
          );
          res.status(parseInt(StatusCode.Success)).send({
            status: StatusCode.Success,
            result: {
              message: messageResponse,
              data: policy.result,
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

    case EmergencyType.Firefighters: {
      const fire = await getFire({
        lat,
        lng,
      });

      switch (fire.status) {
        case StatusCode.Success: {
          const messageResponse = await generateFireResponseMessage(
            message,
            germiniChat
          );
          res.status(parseInt(StatusCode.Success)).send({
            status: StatusCode.Success,
            result: {
              message: messageResponse,
              data: fire.result,
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

    case EmergencyType.Others: {
      const messageResponse = await generateGenericResponseMessage(
        message,
        germiniChat
      );
      res.status(parseInt(StatusCode.Success)).send({
        status: StatusCode.Success,
        result: {
          message: messageResponse,
          data: {},
        } as EmergencyResponse,
      });
      break;
    }
  }
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
  return responses.replace(/\[.*?\]/g, '');
}

async function generatePolicyResponseMessage(
  message: string,
  chat: ChatService
): Promise<string> {
  const responses = await chat.sendMessage(
    `Preciso de uma mensagem amigavel falando para a pessoa procurar um batalhao ou local de policia. Baseie a resposta nessa mensagem: ${message}. No final, fale que estou recomendando um batalhao mais proximo e que a baixo tem link para o Uber, google maps ou waze. Colocar mensagem generica, sem dados do batalhao.  NAO COLOCAR PREFIXOS PARA SUBSTITUIR POR NOMES.`
  );
  return responses.replace(/\[.*?\]/g, '');
}

async function generateFireResponseMessage(
  message: string,
  chat: ChatService
): Promise<string> {
  const responses = await chat.sendMessage(
    `Preciso de uma mensagem amigavel falando para a pessoa procurar um batalhao ou local de bombeiros. Baseie a resposta nessa mensagem: ${message}. No final, fale que estou recomendando um batalhao mais proximo e que a baixo tem link para o Uber, google maps ou waze. Colocar mensagem generica, sem dados do batalhao de bombeiros.  NAO COLOCAR PREFIXOS PARA SUBSTITUIR POR NOMES. SEM PREFIXOS`
  );
  return responses.replace(/\[.*?\]/g, '');
}

async function generateGenericResponseMessage(
  message: string,
  chat: ChatService
): Promise<string> {
  const responses = await chat.sendMessage(
    `Preciso de uma mensagem amigavel falando para a pessoa que nao conseguiu encontrar uma emergencia para recomendar. Baseie a resposta nessa mensagem: ${message}.`
  );
  return responses.replace(/\[.*?\]/g, '');
}

export { getEmergency };
