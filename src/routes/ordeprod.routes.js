/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de órdenes de trabajo ORDEPROD

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 25/Septiembre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con ordeprod.controller.js.

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
    consultarDetalle
} from '../controllers/ordeprod.controller.js';

const router = Router();

router.get('/', autenticarUsuario, validarPermiso(8, 'consulta'), consultar);
router.get('/:codigo', autenticarUsuario, validarPermiso(8, 'consulta'), consultarDetalle);

export default router;