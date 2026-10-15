/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de usuarios

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con usuarios.controller.js.

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
    activar,
    desactivar,
    eliminar
} from '../controllers/usuarios.controller.js';

const router = Router();


router.get('/', autenticarUsuario, validarPermiso(2, 'consulta'), consultar);

router.post('/', autenticarUsuario, validarPermiso(2, 'insercion'), crear);

router.put('/:codigo', autenticarUsuario, validarPermiso(2, 'actualiza'), actualizar);

router.patch('/:codigo/activar', autenticarUsuario, validarPermiso(2, 'actualiza'), activar);

router.patch('/:codigo/desactivar', autenticarUsuario, validarPermiso(2, 'actualiza'), desactivar);

router.delete('/:codigo', autenticarUsuario, validarPermiso(2, 'elimina'), eliminar);


export default router;