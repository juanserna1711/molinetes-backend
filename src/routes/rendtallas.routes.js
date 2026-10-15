/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de rendimientos por talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con rendtallas.controller.js.

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
} from '../controllers/rendtallas.controller.js';

const router = Router();


router.get('/', autenticarUsuario, validarPermiso(6, 'consulta'), consultar);

router.post('/', autenticarUsuario, validarPermiso(6, 'insercion'), crear);

router.put('/:codigo', autenticarUsuario, validarPermiso(6, 'actualiza'), actualizar);

router.delete('/:codigo', autenticarUsuario, validarPermiso(6, 'elimina'), eliminar);


export default router;