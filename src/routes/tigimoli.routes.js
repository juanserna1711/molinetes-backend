import { Router } from 'express';

import {
    consultar,
    consultarDetalle,
    crear
} from '../controllers/tigimoli.controller.js';

const router = Router();


router.get('/', consultar);

router.get('/detalle', consultarDetalle);

router.post('/', crear);


export default router;