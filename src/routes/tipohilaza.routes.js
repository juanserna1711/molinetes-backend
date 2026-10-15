/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de tipos de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con tipohilaza.controller.js.

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
    crear,
    actualizar,
    eliminar
} from '../controllers/tipohilaza.controller.js';

const router = Router();


router.get('/', autenticarUsuario, validarPermiso(4, 'consulta'), consultar);

router.post('/', autenticarUsuario, validarPermiso(4, 'insercion'), crear);

router.put('/:codigo', autenticarUsuario, validarPermiso(4, 'actualiza'), actualizar);

router.delete('/:codigo', autenticarUsuario, validarPermiso(4, 'elimina'), eliminar);


export default router;