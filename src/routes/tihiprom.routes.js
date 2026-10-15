/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de promedios por tipo de hilaza

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 24/Septiembre/2026

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con tihiprom.controller.js.

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
} from '../controllers/tihiprom.controller.js';

const router = Router();


router.get('/', autenticarUsuario, validarPermiso(5, 'consulta'), consultar);

router.post('/', autenticarUsuario, validarPermiso(5, 'insercion'), crear);

router.put('/:tipoHilaza/:talla', autenticarUsuario, validarPermiso(5, 'actualiza'), actualizar);

router.delete('/:tipoHilaza/:talla', autenticarUsuario, validarPermiso(5, 'elimina'), eliminar);


export default router;