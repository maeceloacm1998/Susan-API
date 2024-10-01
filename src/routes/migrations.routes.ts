import {
  getFireMigrations,
  getHospitalMigrations,
  getPolicyMigrations,
} from "@/controller/migrations.controller";
import { Router } from "express";

function migrationRoutes(route: Router) {
  /**
   * Essa chamada retorna o servico de emergencia mais proximo.
   * @param latitude: a latitude do usuário
   * @param longitude: a longitude do usuário
   * @param message: a mensagem que o usuario digitou
   *
   * Exemplo de uso:
   * /api/search/emergency?latitude=-19.9198&longitude=-43.9386&message=acidente
   */
  route.route("/api/migrations/hospital").post(getHospitalMigrations);

  route.route("/api/migrations/policy").post(getPolicyMigrations);
  route.route("/api/migrations/fire").post(getFireMigrations);
}

export { migrationRoutes };
