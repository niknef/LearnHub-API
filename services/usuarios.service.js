import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("AH20232CP1");
const usuarios = db.collection("usuarios");

export async function createUser(usuario){
    await client.connect();
    
    const existe = await usuarios.findOne({email: usuario.email});
    if(existe) throw new Error("El usuario ya existe");
    
    usuarios.insertOne(usuario);
    return usuario;
}