import {Router} from "express"
import {susanRoutes} from "./susan.routes"
import { migrationRoutes } from "./migrations.routes"


export function invoke(): Router {
    const router = Router()
    susanRoutes(router)
    migrationRoutes(router)
    return router
}