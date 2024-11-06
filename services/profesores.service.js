import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("AH20232CP1");

// Obtener todos los profesores con datos de usuario (sin los eliminados)
export async function getProfesores() {
    await client.connect();
    return db.collection("Profesores")
        .aggregate([
            { $match: { eliminado: { $ne: true } } }, // Filtra los eliminados
            {
                $lookup: {
                    from: "Usuarios",
                    localField: "userId",
                    foreignField: "_id",
                    as: "usuarioDatos"
                }
            },
            {
                $project: {
                    "usuarioDatos.password": 0 // Oculta campos sensibles
                }
            }
        ])
        .toArray();
}

// Obtener un profesor por su ID, incluyendo datos de usuario
export async function getProfesorId(id) {
    await client.connect();
    return db.collection("Profesores")
        .aggregate([
            { $match: { _id: ObjectId.createFromHexString(id), eliminado: { $ne: true } } },
            {
                $lookup: {
                    from: "Usuarios",
                    localField: "userId",
                    foreignField: "_id",
                    as: "usuarioDatos"
                }
            },
            {
                $project: {
                    "usuarioDatos.password": 0 // Oculta campos sensibles
                }
            }
        ])
        .toArray();
}

// Agregar nuevo Profesor
export async function agregarProfesor(profesor) {
    await client.connect();
    return db.collection("Profesores").insertOne(profesor);
}

// Modificar Profesor
export async function modificarProfesor(id, datos) {
    await client.connect();
    const profesorModificado = await db.collection("Profesores").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: datos });

    return profesorModificado;
}

// Actualizar Profesor por su ID
export async function actualizarProfesor(id, profesorModificado) {
    await client.connect();
    const profesorActualizado = await db.collection("Profesores").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: profesorModificado });

    return profesorActualizado;
}

// Eliminar Profesor (marcar como eliminado)
export async function eliminarProfesor(id) {
    await client.connect();
    return db.collection("Profesores")
        .updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: { eliminado: true } });
}

// Agregar un curso a un profesor
export async function agregarCursoProfesor(idProfesor, idCurso) {
    await client.connect();
    const curso = await db.collection("Cursos").findOne({ _id: ObjectId.createFromHexString(idCurso) });
    const resultado = await db.collection("Profesores").updateOne(
        { _id: ObjectId.createFromHexString(idProfesor) },
        { $push: { cursos: curso } }
    );

    return resultado.modifiedCount > 0 ? "Curso agregado" : "No se agregó el curso";
}


// Consulto con $lookup para unir la colección Usuarios con Profesores en base a userId. Esto traerá todos los datos relevantes del usuario.
// Proyección de datos $project Incluye password en $project para excluirlo de la respuesta y evitar exponer datos sensibles.
// Con este ajuste, tu servicio de profesores tendrá la capacidad de agregar automáticamente la información del usuario al realizar consultas, manteniendo el esquema y la consulta organizados y eficientes.