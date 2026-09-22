/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de cálculos TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con tigimoli.controller.js.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { Router } from 'express';

import {
    consultar,
    consultarDetalle,
    crear
} from '../controllers/tigimoli.controller.js';

const router = Router();


router.get('/', consultar);

router.get('/detalle', consultarDetalle);

router.post('/', crear);


export default router;