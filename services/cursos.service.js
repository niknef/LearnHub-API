import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("AH20232CP1");

// Función para capitalizar la primera letra de cada palabra
function capitalize(texto) {
    if (!texto) return '';
    return texto
        .toLowerCase() // Convertir todo a minúsculas
        .replace(/\b\w/g, (letra) => letra.toUpperCase()); // Capitalizar la primera letra de cada palabra
}

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

    // Resolver datos de categorías, tecnologías y profesor
    for (let curso of cursos) {
        // Obtener el nombre de la categoría
        if (curso.categoriaId) {
            const categoria = await db.collection("Categorias").findOne({ _id: new ObjectId(curso.categoriaId) });
            curso.categoria = categoria ? categoria.nombre : 'Categoría no disponible';
        }

        // Obtener los nombres de las tecnologías
        if (curso.tecnologiasId && Array.isArray(curso.tecnologiasId)) {
            const tecnologias = await db.collection("Tecnologias").find({
                _id: { $in: curso.tecnologiasId.map(id => new ObjectId(id)) }
            }).toArray();
            curso.tecnologias = tecnologias.map(tec => tec.nombre);
        }

        // Obtener los datos del profesor
        if (curso.profesorId) {
            const profesor = await db.collection("Profesores").findOne({ _id: new ObjectId(curso.profesorId) });
            if (profesor && profesor.userId) {
                // Obtener el nombre y apellido del usuario correspondiente al profesor
                const usuario = await db.collection("Usuarios").findOne({ _id: new ObjectId(profesor.userId) });
                if (usuario) {
                    const nombreCompleto = `${capitalize(usuario.nombre)} ${capitalize(usuario.apellido)}`;
                    curso.profesor = nombreCompleto;
                } else {
                    curso.profesor = 'Profesor no disponible';
                }
            } else {
                curso.profesor = 'Profesor no disponible';
            }
        }
    }

    return cursos;
}

export async function getCursoId(id_ingresado) {
    await client.connect();

    // Encontrar el curso
    const curso = await db.collection("Cursos").findOne({ _id: ObjectId.createFromHexString(id_ingresado) });
    if (!curso) return null;

    // Obtener el nombre de la categoría
    if (curso.categoriaId) {
        const categoria = await db.collection("Categorias").findOne({ _id: new ObjectId(curso.categoriaId) });
        curso.categoria = categoria ? categoria.nombre : 'Categoría no disponible';
    }

    // Obtener los nombres de las tecnologías
    if (curso.tecnologiasId && Array.isArray(curso.tecnologiasId)) {
        const tecnologias = await db.collection("Tecnologias").find({
            _id: { $in: curso.tecnologiasId.map(id => new ObjectId(id)) }
        }).toArray();
        curso.tecnologias = tecnologias.map(tec => tec.nombre);
    }

    // Obtener los datos del profesor
    if (curso.profesorId) {
        const profesor = await db.collection("Profesores").findOne({ _id: new ObjectId(curso.profesorId) });
        if (profesor && profesor.userId) {
            // Obtener el nombre y apellido del usuario correspondiente al profesor
            const usuario = await db.collection("Usuarios").findOne({ _id: new ObjectId(profesor.userId) });
            if (usuario) {
                const nombreCompleto = `${capitalize(usuario.nombre)} ${capitalize(usuario.apellido)}`;
                curso.profesor = nombreCompleto;
            } else {
                curso.profesor = 'Profesor no disponible';
            }
        } else {
            curso.profesor = 'Profesor no disponible';
        }
    }

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
    // Insertar el curso en la colección de Cursos
    const cursoInsertado = await db.collection("Cursos").insertOne(curso);

    // Ahora actualizar el documento del profesor
    const profesorId = curso.profesorId;
    if (profesorId) {
        // Actualizamos el documento del profesor agregando el cursoId al array cursosId
        await db.collection("Profesores").updateOne(
            { _id: new ObjectId(profesorId) },
            { $push: { cursosId: cursoInsertado.insertedId } }  // Usamos $push para agregar el cursoId al array
        );
    }
    
    return cursoInsertado
}


