import * as service from '../../services/usuarios.service.js';

export function createUser(req,res){
    service.createUser(req.body)
        .then( (usuario) => res.status(201).json(usuario) )
        .catch( (error) => res.status(500).json({error: error}) )
}

export function login(req,res){
    service.login(req.body)
        .then( (usuario) => res.status(200).json(usuario) )
        .catch( (error) => res.status(500).json({error: error}) )
}