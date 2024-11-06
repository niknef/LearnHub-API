import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("AH20232CP1");

export async function getCursos(filtros = {}) {
    const filterMongo = { eliminado: { $ne: true } };
    const sortCriteria = {};

    // Filtro por categoría
    if (filtros.categoria !== undefined) {
        filterMongo.categoria = { $eq: filtros.categoria };
    }
    if (filtros.ordenDuracion !== undefined) {
        const order = filtros.ordenDuracion.toLowerCase() === 'asc' ? 1 : -1;
        sortCriteria.horas = order;
    }

    await client.connect();
    const cursos = await db.collection("Cursos")
        .find(filterMongo)
        .sort(sortCriteria)
        .toArray();

    // Resolver nombres de categorías y tecnologías
    for (let curso of cursos) {
        // Obtener nombre de la categoría
        const categoria = await db.collection("Categorias").findOne({ _id: curso.categoriaId });
        curso.categoria = categoria ? categoria.nombre : null;

        // Obtener nombres de las tecnologías
        const tecnologias = await db.collection("Tecnologias").find({
            _id: { $in: curso.tecnologiasId }
        }).toArray();
        curso.tecnologias = tecnologias.map(tec => tec.nombre);
    }

    return cursos;
}

export async function getCursoId(id_ingresado) {
    await client.connect();

    // Encontrar el curso
    const curso = await db.collection("Cursos").findOne({ _id: ObjectId.createFromHexString(id_ingresado) });
    if (!curso) return null;

    // Obtener nombre de la categoría
    const categoria = await db.collection("Categorias").findOne({ _id: curso.categoriaId });
    curso.categoria = categoria ? categoria.nombre : null;

    // Obtener nombres de las tecnologías
    const tecnologias = await db.collection("Tecnologias").find({
        _id: { $in: curso.tecnologiasId }
    }).toArray();
    curso.tecnologias = tecnologias.map(tec => tec.nombre);

    return curso;
}

export async function eliminarCurso(id_ingresado){
    await client.connect()
    await db.collection("Cursos").updateOne({ _id: ObjectId.createFromHexString(id_ingresado)}, { $set: {
        eliminado: true
    } })

    return id_ingresado
}

export async function modificarCurso(id_ingresado, datos){
    await client.connect()
    const cursoModificado = await db.collection("Cursos").updateOne({ _id: ObjectId.createFromHexString(id_ingresado)}, { $set: datos })

    return cursoModificado
}

export async function actualizarCurso(id, cursoModificado) {
    await client.connect()
    const cursoActualizado = await db.collection("Cursos").updateOne({_id: ObjectId.createFromHexString(id)}, { $set: cursoModificado })
    return cursoActualizado
}

export async function agregarCurso(curso){
    await client.connect()
    await db.collection("Cursos").insertOne(curso)
    return curso
}


