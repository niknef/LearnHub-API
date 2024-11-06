import { Router } from "express";
import * as controller from "../controllers/tecnologias.controller.js"
import { validateTecnologia } from "../../middleware/tecnologias.validate.middleware.js"

const route = Router()

route.get( "/tecnologias", controller.getTecnologias ) // traemos todas las tecnologias

route.get( "/tecnologias/:id", controller.getTecnologiaId ) // traemos la tecnologia por id

route.post( "/tecnologias", [validateTecnologia], controller.agregarTecnologia ) // agregamos una tecnologia

route.patch("/tecnologias/:id", controller.actualizarTecnologia) // actualizamos una tecnologia

route.delete("/tecnologias/:id", controller.eliminarTecnologia)  // eliminamos una tecnologia

export default route