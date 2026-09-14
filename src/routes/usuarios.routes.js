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