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

import {
    consultar,
    crear,
    actualizar,
    eliminar
} from '../controllers/tipohilaza.controller.js';

const router = Router();


router.get('/', consultar);

router.post('/', crear);

router.put('/:codigo', actualizar);

router.delete('/:codigo', eliminar);


export default router;