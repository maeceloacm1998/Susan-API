import { getEmergency } from "@/controller/susan.controller";
import { handleEmergencyResult } from "@/controller/susan.result.controller";
import { Router } from "express";

function susanRoutes(route: Router) {
  /**
   * Essa chamada retorna o servico de emergencia mais proximo.
   * @param latitude: a latitude do usuário
   * @param longitude: a longitude do usuário
   * @param message: a mensagem que o usuario digitou
   * 
   * Exemplo de uso:
   * /api/search/emergency?latitude=-19.9198&longitude=-43.9386&message=acidente
   */
  route
    .route("/api/search/emergency")
    .post(getEmergency);

    route
    .route("/api/search/emergency/result")
    .post(handleEmergencyResult);
}

export { susanRoutes };
