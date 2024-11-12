import { EmergencyRequest } from "@/models/types/emergency.request.model";
import { EmergencyResponse } from "@/models/types/emergency.response.model";
import { EmergencyType } from "@/models/types/emergency.types.model";
import { StatusCode } from "@/models/types/status.code";
import { ChatService } from "@/services/chat.service";
import { getFire, getHospital, getPolicy } from "@/services/db.service";
import { Request, Response } from "express";

async function getEmergencyResult(emergencyRequest: EmergencyRequest, emergencyType: string, germiniChat: ChatService): Promise<EmergencyResponse> {

    switch (emergencyType.trim()) {
        case EmergencyType.Hospital: {
            const hospital = await getHospital({
                lat: emergencyRequest.lat,
                lng: emergencyRequest.lng,
            });

            switch (hospital.status) {
                case StatusCode.Success: {
                    const messageResponse = await generateHospitalResponseMessage(
                        emergencyRequest.message,
                        germiniChat
                    );

                    log("response - hospital", messageResponse);
                    log("response - hospital", hospital.result.toString());

                    return {
                        message: messageResponse,
                        data: hospital.result,
                    }
                }
            }
            break;
        }

        case EmergencyType.Police: {
            const policy = await getPolicy({
                lat: emergencyRequest.lat,
                lng: emergencyRequest.lng,
            });

            switch (policy.status) {
                case StatusCode.Success: {
                    const messageResponse = await generatePolicyResponseMessage(
                        emergencyRequest.message,
                        germiniChat
                    );

                    log("response - policy", messageResponse);
                    log("response - policy", policy.result.toString());

                    return {
                        message: messageResponse,
                        data: policy.result,
                    }
                }
            }
            break;
        }

        case EmergencyType.Firefighters: {
            const fire = await getFire({
                lat: emergencyRequest.lat,
                lng: emergencyRequest.lng,
            });

            switch (fire.status) {
                case StatusCode.Success: {
                    const messageResponse = await generateFireResponseMessage(
                        emergencyRequest.message,
                        germiniChat
                    );

                    log("response - bombeiros", messageResponse);
                    log("response - bombeiros", fire.result.toString());

                    return {
                        message: messageResponse,
                        data: fire.result,
                    }
                }
            }
            break;
        }

        case EmergencyType.Others: {
            const messageResponse = await generateGenericResponseMessage(
                emergencyRequest.message,
                germiniChat
            );

            log("response - others", messageResponse);

            return {
                message: messageResponse,
                data: {},
            } as EmergencyResponse
        }
    }

    return {
        message: "Erro ao tentar encontrar a emergência mais próxima",
        data: {},
    } as EmergencyResponse
}

async function getEmergencyType(
    message: string,
    chat: ChatService
): Promise<string> {
    try {
        const types = Object.values(EmergencyType);
        const responses = await chat.sendMessage(
            `What type of emergency is this? ${message}, my services are: ${types.join(
                ", "
            )}. Send only the type of emergency.`
        );
        return responses;
    } catch (error) {
        console.error(error);
        return "Erro ao tentar encontrar o tipo de emergência";
    }
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

interface EmergencyResType {
    descricao: string,
    tipo: string
}

function getEmergencyResponse(): Array<EmergencyResType> {
    return [
        { descricao: "Um homem está tendo um ataque cardíaco", tipo: "Emergência Cardíaca" },
        { descricao: "Há um incêndio na casa", tipo: "Emergência de Incêndio" },
        { descricao: "Estou preso em um carro após um acidente", tipo: "Emergência de Acidente" },
        { descricao: "Uma mulher está engasgando em um restaurante", tipo: "Emergência de Engasgamento" },
        { descricao: "Há um assalto em andamento", tipo: "Emergência de Assalto" },
        { descricao: "Uma mulher está reclamando de dor intensa no peito e tontura", tipo: "Emergência Cardíaca" },
        { descricao: "Cheiro de fumaça vindo da cozinha", tipo: "Emergência de Incêndio" },
        { descricao: "Um carro bateu em uma árvore perto do parque", tipo: "Emergência de Acidente" },
        { descricao: "Um homem está tendo um ataque cardíaco", tipo: "Emergência Cardíaca" },
        { descricao: "Ouço vidro quebrando na casa do meu vizinho", tipo: "Emergência de Assalto" },
        { descricao: "Um homem desmaiou de repente e está inconsciente", tipo: "Emergência Cardíaca" },
        { descricao: "Cheiro de fumaça vindo do porão", tipo: "Emergência de Incêndio" },
        { descricao: "Carro atingido por uma árvore", tipo: "Emergência de Acidente" },
        { descricao: "Não consigo respirar", tipo: "Emergência de Engasgamento" },
        { descricao: "Estou ouvindo vidro quebrando fora da minha janela", tipo: "Emergência de Assalto" },
        { descricao: "Um homem está experimentando palpitações e falta de ar", tipo: "Emergência Cardíaca" },
        { descricao: "Há uma lata de lixo pegando fogo no beco", tipo: "Emergência de Incêndio" },
        { descricao: "Um veículo capotou em uma rodovia movimentada", tipo: "Emergência de Acidente" },
        { descricao: "Há um incêndio na casa", tipo: "Emergência de Incêndio" },
        { descricao: "Há alguém tentando arrombar meu carro", tipo: "Emergência de Assalto" },
        { descricao: "Uma mulher está experimentando dor intensa no peito e falta de ar", tipo: "Emergência Cardíaca" },
        { descricao: "Há um incêndio elétrico na cozinha", tipo: "Emergência de Incêndio" },
        { descricao: "Escorregou e caiu em um piso molhado", tipo: "Emergência de Acidente" },
        { descricao: "Meu amigo começou a engasgar com a comida de repente", tipo: "Emergência de Engasgamento" },
        { descricao: "Alguém está tentando forçar a entrada da minha porta da frente", tipo: "Emergência de Assalto" },
        { descricao: "Um membro da família está ligando sobre o colapso repentino do pai", tipo: "Emergência Cardíaca" },
        { descricao: "Cigarro aceso deixado sem supervisão na sala de estar", tipo: "Emergência de Incêndio" },
        { descricao: "Dois carros colidiram em um cruzamento", tipo: "Emergência de Acidente" },
        { descricao: "Estou preso em um carro após um acidente", tipo: "Emergência de Acidente" },
        { descricao: "Um som alto de batida vindo do apartamento 4B", tipo: "Emergência de Assalto" },
        { descricao: "Uma criança pequena está em sofrimento sem causa aparente", tipo: "Emergência Cardíaca" },
        { descricao: "O elevador de um prédio residencial está pegando fogo", tipo: "Emergência de Incêndio" },
        { descricao: "Dois carros colidiram em um cruzamento", tipo: "Emergência de Acidente" },
        { descricao: "Minha filha está tossindo severamente após engolir um pequeno objeto", tipo: "Emergência de Engasgamento" },
        { descricao: "Um homem está gritando por ajuda; ele foi assaltado à mão armada", tipo: "Emergência de Assalto" },
        { descricao: "Uma pessoa idosa está relatando fadiga extrema e náusea", tipo: "Emergência Cardíaca" },
        { descricao: "O alarme de incêndio disparou no prédio do escritório", tipo: "Emergência de Incêndio" },
        { descricao: "Um caminhão foi atingido por um objeto caindo", tipo: "Emergência de Acidente" },
        { descricao: "Uma mulher está engasgando em um restaurante", tipo: "Emergência de Engasgamento" },
        { descricao: "Vejo uma pessoa suspeita correndo com uma mochila em um estacionamento", tipo: "Emergência de Assalto" },
        { descricao: "A família encontrou um incêndio na sala de estar", tipo: "Emergência de Incêndio" },
        { descricao: "Bicicleta colidiu com um carro estacionado", tipo: "Emergência de Acidente" },
        { descricao: "Uma criança está engasgando com um pedaço de brinquedo", tipo: "Emergência de Engasgamento" },
        { descricao: "Há alguém dentro da casa que não nos deixa entrar", tipo: "Emergência de Assalto" },
        { descricao: "Um cliente em um restaurante está com dificuldade para respirar e suando profusamente", tipo: "Emergência Cardíaca" },
        { descricao: "Uma fogueira que saiu do controle", tipo: "Emergência de Incêndio" },
        { descricao: "Um ônibus escolar descarrilou", tipo: "Emergência de Acidente" },
        { descricao: "Há um assalto em andamento", tipo: "Emergência de Assalto" },
        { descricao: "Meu alarme de segurança residencial está apitando", tipo: "Emergência de Assalto" },
        { descricao: "Há um alarme de incêndio ativado em uma escola", tipo: "Emergência de Incêndio" },
        { descricao: "Caminhão tombou na rodovia", tipo: "Emergência de Acidente" },
        { descricao: "A pessoa tem um pedaço de comida preso na garganta", tipo: "Emergência de Engasgamento" },
        { descricao: "Um estudante do ensino médio está se sentindo muito fraco e desorientado de repente", tipo: "Emergência Cardíaca" },
        { descricao: "Vejo uma casa pegando fogo da minha janela", tipo: "Emergência de Incêndio" },
        { descricao: "Uma bicicleta colidiu com uma loja", tipo: "Emergência de Acidente" },
        { descricao: "Criança está tossindo e não consegue respirar após comer", tipo: "Emergência de Engasgamento" },
        { descricao: "Encontrei uma porta entreaberta com minhas joias desaparecidas", tipo: "Emergência de Assalto" },
        { descricao: "Uma chamada sobre um grande incêndio florestal nas proximidades", tipo: "Emergência de Incêndio" },
        { descricao: "Barco virou perto da marina", tipo: "Emergência de Acidente" },
        { descricao: "Um adolescente está engasgando e não consegue desobstruir a garganta", tipo: "Emergência de Engasgamento" },
        { descricao: "Um professor está notando um aluno desmaiar sem pulso", tipo: "Emergência Cardíaca" },
        { descricao: "O motor do meu carro está pegando fogo após um acidente", tipo: "Emergência de Incêndio" },
        { descricao: "Um caminhão de bombeiros respondendo a um engavetamento de vários veículos", tipo: "Emergência de Acidente" },
        { descricao: "Estou vendo chamas fora da janela de uma loja", tipo: "Emergência de Incêndio" },
        { descricao: "Um caminhante tropeçou na calçada", tipo: "Emergência de Acidente" },
        { descricao: "Um homem idoso está tossindo, mas não consegue desobstruir a garganta", tipo: "Emergência de Engasgamento" },
        { descricao: "Um corredor foi levado para a sala de emergência com dor no peito após correr", tipo: "Emergência Cardíaca" },
        { descricao: "Uma linha de energia pegou fogo perto da minha casa", tipo: "Emergência de Incêndio" },
        { descricao: "Uma caminhonete capotou após bater em um guard rail", tipo: "Emergência de Acidente" },
        { descricao: "Alguém gritou que há um incêndio no apartamento 3B", tipo: "Emergência de Incêndio" },
        { descricao: "Skatista caiu da rampa", tipo: "Emergência de Acidente" },
    ];
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface EmergencyResultWithTypes {
    message: string;
    messageType: string;
    emergencyType: string;
    data: EmergencyResponse;
}

async function handleEmergencyResult(req: Request, res: Response) {
    const germiniChat = new ChatService();

    const emergencies = getEmergencyResponse();
    const response: EmergencyResultWithTypes[] = [];
    console.log(req.body);

    for (const emergency of emergencies) {
        const emergencyType = await getEmergencyType(emergency.descricao, germiniChat);

        const ai = await getEmergencyResult({
            lat: -19.8373753,
            lng: -43.9838429,
            message: emergency.descricao,
        }, emergencyType, germiniChat);

        response.push({
            message: emergency.descricao,
            messageType: emergency.tipo,
            emergencyType: emergencyType,
            data: ai
        });

        // Add a delay of 1 second (1000 milliseconds) between each iteration
        await delay(20000);
    }

    res.status(200).send(response);
}

export { handleEmergencyResult };

