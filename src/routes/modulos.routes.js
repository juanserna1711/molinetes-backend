/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de módulos

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 08/Octubre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con modulos.controller.js.

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
} from '../controllers/modulos.controller.js';

const router = Router();


router.get('/', autenticarUsuario, validarPermiso(9, 'consulta'), consultar);

router.post('/', autenticarUsuario, validarPermiso(9, 'insercion'), crear);

router.put('/:codigo', autenticarUsuario, validarPermiso(9, 'actualiza'), actualizar);

router.delete('/:codigo', autenticarUsuario, validarPermiso(9, 'elimina'), eliminar);


export default router;