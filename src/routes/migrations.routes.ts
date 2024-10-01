import {
  getFireMigrations,
  getHospitalMigrations,
  getPolicyMigrations,
} from "@/controller/migrations.controller";
import { Router } from "express";

function migrationRoutes(route: Router) {
  /**
   * Todas essas rotas sao responsaveis para migrar items de policia, hospita e fire. 
   * Hoje, caso queria adicionar alguma policia ou hospital, basta entrar nessa rota e enviar um array dos items que voce deseja mandar,
   * mas voce vai precisar fazer alguns ajustes.
   */
  route.route("/api/migrations/hospital").post(getHospitalMigrations);
  route.route("/api/migrations/policy").post(getPolicyMigrations);
  route.route("/api/migrations/fire").post(getFireMigrations);
}

export { migrationRoutes };
