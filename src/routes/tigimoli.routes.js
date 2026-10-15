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
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import { validarPermiso } from '../middlewares/permisos.middleware.js';

import {crear} from '../controllers/tigimoli.controller.js';

const router = Router();

router.post('/', autenticarUsuario, validarPermiso(7, 'insercion'), crear);


export default router;