import express from "express"
import apiCursoRoute from "./api/routes/cursos.routes.js"
import apiClienteRoute from "./api/routes/clientes.routes.js"

const app = express()

app.use( express.static("public") )
app.use( express.urlencoded({ extended: true }) )
app.use( express.json() )

app.use("/api",apiCursoRoute)
app.use("/api",apiClienteRoute)


app.listen(3333, () => console.log("Servidor funcionando"))