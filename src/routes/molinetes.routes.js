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

import {
    consultar,
    crear,
    actualizar,
    eliminar
} from '../controllers/molinetes.controller.js';

const router = Router();


router.get('/', consultar);

router.post('/', crear);

router.put('/:codigo', actualizar);

router.delete('/:codigo', eliminar);


export default router;