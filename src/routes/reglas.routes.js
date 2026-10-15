/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de reglas

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con reglas.controller.js.

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
    consultarMisPermisos,
    crear,
    actualizar,
    eliminar
} from '../controllers/reglas.controller.js';

const router = Router();

router.get('/mis-permisos', autenticarUsuario, consultarMisPermisos);

router.get('/', autenticarUsuario, validarPermiso(10, 'consulta'), consultar);

router.post('/', autenticarUsuario, validarPermiso(10, 'insercion'), crear);

router.put('/:codigo', autenticarUsuario, validarPermiso(10, 'actualiza'), actualizar);

router.delete('/:codigo', autenticarUsuario, validarPermiso(10, 'elimina'), eliminar);


export default router;