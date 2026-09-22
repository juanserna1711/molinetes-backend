/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de usuarios

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con usuarios.controller.js.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import { Router } from 'express';

import {
    consultar,
    crear,
    actualizar,
    activar,
    desactivar,
    eliminar
} from '../controllers/usuarios.controller.js';

const router = Router();


router.get('/', consultar);

router.post('/', crear);

router.put('/:codigo', actualizar);

router.patch('/:codigo/activar', activar);

router.patch('/:codigo/desactivar', desactivar);

router.delete('/:codigo', eliminar);


export default router;