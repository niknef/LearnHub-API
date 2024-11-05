import {Router} from 'express';
import * as controller from '../controllers/usuarios.controller.js';
import { validateUser } from '../../middleware/usuarios.validate.middleware.js';

const route = Router();

route.post('/usuarios', [validateUser],controller.createUser);

export default route;
