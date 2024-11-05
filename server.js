import express from "express"
import apiCursoRoute from "./api/routes/cursos.routes.js"
import apiClienteRoute from "./api/routes/clientes.routes.js"
import apiUsuarioRoute from "./api/routes/usuarios.routes.js"
import cors from "cors"

const app = express()

app.use( express.static("public") )
app.use( express.urlencoded({ extended: true }) )
app.use( express.json() )

const corsOptions = {
    origin: "http://localhost:5173", // LearnHub-Front 
    methods: "GET,POST,PUT,DELETE" //Metodos Permitidos

}

app.use( cors(corsOptions) )

app.use("/api",apiCursoRoute)
app.use("/api",apiClienteRoute)
app.use("/api",apiUsuarioRoute)


app.listen(3333, () => console.log("Servidor funcionando"))