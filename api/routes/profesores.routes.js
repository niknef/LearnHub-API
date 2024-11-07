import { Router } from "express";
import * as controller from "../controllers/profesores.controller.js"

const route = Router()

route.get( "/profesores", controller.getProfesores ) // traemos todos los profesores

route.get( "/profesores/:id", controller.getProfesorId ) // traemos el Profesor por id

route.post( "/profesores", controller.agregarProfesor ) // agregamos un Profesor

route.patch("/profesores/:id", controller.actualizarProfesor) // actualizamos un Profesor

route.delete("/profesores/:id", controller.eliminarProfesor) // eliminamos un Profesor


export default route