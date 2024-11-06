import { Router } from "express";
import * as controller from "../controllers/categorias.controller.js"
import { validateCategoria } from "../../middleware/categorias.validate.middleware.js"

const route = Router()

route.get( "/categorias", controller.getCategorias ) // traemos todas las categorias

route.get( "/categorias/:id", controller.getCategoriaId ) // traemos la categoria por id

route.post( "/categorias", [validateCategoria], controller.agregarCategoria ) // agregamos una categoria

route.patch("/categorias/:id", controller.actualizarCategoria) // actualizamos una categoria

route.delete("/categorias/:id", controller.eliminarCategoria)  // eliminamos una categoria

export default route