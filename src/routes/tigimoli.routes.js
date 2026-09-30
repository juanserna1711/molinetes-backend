/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de cálculos TIGIMOLI

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con tigimoli.controller.js.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { Router } from 'express';

import {
    crear
} from '../controllers/tigimoli.controller.js';

const router = Router();

router.post('/', crear);


export default router;