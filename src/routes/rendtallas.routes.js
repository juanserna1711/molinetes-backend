/*=============================================================================
  Nombre responsabilidad: Enrutamiento HTTP de rendimientos por talla

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Relaciona los endpoints del recurso con rendtallas.controller.js.

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
    eliminar
} from '../controllers/rendtallas.controller.js';

const router = Router();


router.get('/', consultar);

router.post('/', crear);

router.put('/:codigo', actualizar);

router.delete('/:codigo', eliminar);


export default router;