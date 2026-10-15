import { Router } from 'express';

import {
    iniciarSesion,
    obtenerSesion,
    cerrarSesion
} from '../controllers/auth.controller.js';

import {
    autenticarUsuario
} from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', iniciarSesion);

router.get('/me', autenticarUsuario, obtenerSesion);

router.post('/logout', autenticarUsuario, cerrarSesion);

export default router;