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
  log("Request Body", JSON.stringify(req.body));
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

          log("response - hospital", messageResponse);
          log("response - hospital", hospital.result.toString());

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

          log("response - policy", messageResponse);
          log("response - policy", policy.result.toString());
          
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

          log("response - bombeiros", messageResponse);
          log("response - bombeiros", fire.result.toString());

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

      log("response - others", messageResponse);
      
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
    `
      Crie uma mensagem resumida, sem uso de figurinhas, emojis ou caracteres especiais.
      Escreva a mensagem orientando a pessoa e buscar o hospital mais proximo dela. 
      Baseie a resposta nessa mensagem: ${message}, que foi enviada pelo usuario. 
      Recomende sempre uma especialidade que ele deve buscar ao ir no hospital.
      No final da frase, SEMPRE falar que a baixo tem um hospital mais proximo, esse hospital foi selecionado no nosso banco de dados.
      NAO COLOCAR PREFIXOS PARA SUBSTITUIR POR NOMES.
    `
  );
  return responses.replace(/\[.*?\]/g, "").replace(/[\n\r\*\_]/g, "").trim();
}

async function generatePolicyResponseMessage(
  message: string,
  chat: ChatService
): Promise<string> {
  const responses = await chat.sendMessage(
    `
      Crie uma mensagem resumida, sem uso de figurinhas, emojis ou caracteres especiais.
      Escreva a mensagem orientando a pessoa ligar e buscar a delegacia de policia mais proximo dela. 
      Baseie a resposta nessa mensagem: ${message}, que foi enviada pelo usuario. 
      No final da frase, SEMPRE falar que a baixo tem uma delegacia mais proximo, essa delegacia foi selecionado no nosso banco de dados.
      NAO COLOCAR PREFIXOS PARA SUBSTITUIR POR NOMES.
    `
  );
  return responses.replace(/\[.*?\]/g, "").replace(/[\n\r\*\_]/g, "").trim();
}

async function generateFireResponseMessage(
  message: string,
  chat: ChatService
): Promise<string> {
  const responses = await chat.sendMessage(
    `
      Crie uma mensagem resumida, sem uso de figurinhas, emojis ou caracteres especiais.
      Escreva a mensagem orientando a pessoa ligar e buscar o corpo de bombeiros mais proximo dela. 
      Baseie a resposta nessa mensagem: ${message}, que foi enviada pelo usuario. 
      No final da frase, SEMPRE falar que a baixo tem um corpo de bombeiros mais proximo, esse corpo de bombeiros foi selecionado no nosso banco de dados.
      NAO COLOCAR PREFIXOS PARA SUBSTITUIR POR NOMES.
    `
  );
  return responses.replace(/\[.*?\]/g, "").replace(/[\n\r\*\_]/g, "").trim();
}

async function generateGenericResponseMessage(
  message: string,
  chat: ChatService
): Promise<string> {
  const responses = await chat.sendMessage(
    `Preciso de uma mensagem seria, sem emojis, curta, falando para a pessoa que nao conseguiu encontrar uma emergencia para recomendar. Baseie a resposta nessa mensagem: ${message}.`
  );
  return responses.replace(/\[.*?\]/g, "").replace(/[\n\r\*\_]/g, "").trim();
}

function log(key: string, data: any) {
  console.log(`LOG - ${getCurrentDate()} [${key}] ${data}`);
}

function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export { getEmergency };
