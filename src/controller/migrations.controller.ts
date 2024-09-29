
import { StatusCode } from "@/models/types/status.code";
import { ChatService } from "@/services/chat.service";
import { Request, Response } from "express";

async function getHospitalMigrations(req: Request, res: Response) {
  const messa: string = req.query.message as string;

  const message = await new ChatService().sendMessage(messa);

  res.status(parseInt(StatusCode.Success)).send(message);
}

export { getHospitalMigrations };
