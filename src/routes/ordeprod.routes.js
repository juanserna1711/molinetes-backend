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

import {
    consultar,
    consultarDetalle
} from '../controllers/ordeprod.controller.js';

const router = Router();

router.get('/', consultar);
router.get('/:codigo', consultarDetalle);

export default router;