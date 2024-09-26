import {Router} from "express"
import {susanRoutes} from "./susan.routes"


export function invoke(): Router {
    const router = Router()
    susanRoutes(router)
    return router
}