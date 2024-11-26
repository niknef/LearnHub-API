import express from "express";
import apiCursoRoute from "./api/routes/cursos.routes.js";
import apiProfesorRoute from "./api/routes/profesores.routes.js";
import apiUsuarioRoute from "./api/routes/usuarios.routes.js";
import apiTecnologiaRoute from "./api/routes/tecnologias.routes.js";
import apiCategoriaRoute from "./api/routes/categorias.routes.js";
import cors from "cors";
import { Server as SocketIO } from "socket.io";
import http from "http";
import multer from "multer";
import sharp from "sharp";

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "*", // Permitir cualquier origen
    methods: ["GET", "POST"],
  },
});

// Configuración inicial de usuarios conectados
const users = {};

// Socket.IO para comunicación en tiempo real
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Respuesta inicial al conectar
  io.emit("respuesta", "Conectado al servidor");

  // Evento de desconexión
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  // Mensajes de chat
  socket.on("chat mensaje", (mensaje) => {
    console.log(mensaje);
    io.emit("chat mensaje", "ECHO: " + mensaje);
  });

  // Nuevo usuario conectado
  socket.on("nuevo usuario", (username) => {
    users[username] = socket.id;
    socket.broadcast.emit("user connected", username);
    socket.username = username; // Asignar el nombre al socket
    console.log(`${username} se ha conectado.`);
  });

  // Mensajes dirigidos entre usuarios
  socket.on("chat message", ({ message, to }) => {
    if (users[to]) {
      socket.to(users[to]).emit("chat message", { message, from: socket.username });
    } else {
      socket.emit("chat message", { message: "Usuario no disponible", from: "Servidor" });
    }
  });
});

// Middleware básicos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: "http://localhost:5173", // Frontend permitido
  methods: "GET,POST,PUT,DELETE", // Métodos permitidos
};
app.use(cors(corsOptions));

// Rutas API
app.use("/api", apiCursoRoute);
app.use("/api", apiProfesorRoute);
app.use("/api", apiUsuarioRoute);
app.use("/api", apiTecnologiaRoute);
app.use("/api", apiCategoriaRoute);

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Carpeta de destino
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.trim().replace(/\s/g, "_")); // Nombre del archivo
  },
});

const upload = multer({ storage });

// Middleware para procesar imágenes con Sharp
async function resizeImage(req, res, next) {
  return sharp(req.file.path)
    .resize(1500) // Redimensionar a 1500px
    .webp() // Convertir a formato WebP
    .rotate(90) // Rotar 90 grados
    .greyscale() // Escala de grises
    .toFile("uploads/" + new Date().getTime() + ".webp")
    .then(() => {
      console.log("Imagen redimensionada");
      next();
    })
    .catch((err) => res.status(500).json({ error: err.message }));
}

// Ruta para subir archivos con procesamiento de imágenes
app.post("/upload", [upload.single("file"), resizeImage], (req, res) => {
  console.log(req.file);
  res.status(200).json({ message: "Archivo subido y procesado correctamente" });
});

// Iniciar el servidor
server.listen(3333, () => console.log("Servidor funcionando en http://localhost:3333"));
