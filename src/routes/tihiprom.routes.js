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

import {
    consultar,
    crear,
    actualizar,
    eliminar,
    aplicar
} from '../controllers/tihiprom.controller.js';

const router = Router();


router.get('/', consultar);

router.post('/', crear);

router.put('/:tipoHilaza/:talla', actualizar);

router.delete('/:tipoHilaza/:talla', eliminar);

router.patch('/:tipoHilaza/aplicar', aplicar);


export default router;