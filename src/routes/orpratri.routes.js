/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de atributos de orden de producción

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 27/Octubre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con orpratri.controller.js.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { Router } from 'express';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import { validarPermiso } from '../middlewares/permisos.middleware.js';

import {
    consultar,
    crear
} from '../controllers/orpratri.controller.js';

const router = Router();


router.get(
    '/:codigo',
    autenticarUsuario,
    validarPermiso(8, 'consulta'),
    consultar
);

router.post(
    '/',
    autenticarUsuario,
    validarPermiso(8, 'insercion'),
    crear
);


export default router;