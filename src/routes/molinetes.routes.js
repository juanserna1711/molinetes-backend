/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con molinetes.controller.js.

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
} from '../controllers/molinetes.controller.js';

const router = Router();


router.get('/', autenticarUsuario, validarPermiso(3, 'consulta'), consultar);

router.post('/', autenticarUsuario, validarPermiso(3, 'insercion'), crear);

router.put('/:codigo', autenticarUsuario, validarPermiso(3, 'actualiza'), actualizar);

router.delete('/:codigo', autenticarUsuario, validarPermiso(3, 'elimina'), eliminar);


export default router;