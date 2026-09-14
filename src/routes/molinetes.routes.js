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