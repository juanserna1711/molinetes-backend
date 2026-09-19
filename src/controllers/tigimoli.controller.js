import {
    consultarTigimoli,
    consultarDetalleTigimoli,
    insertarTigimoli,
} from '../services/tigimoli.service.js';

import { handleError } from '../utils/handleError.js';


export async function consultar(req, res) {
    try {
        const {
            codigo,
            nombre,
            fecha,
            pagina,
            registrosPagina
        } = req.query;

        const tigimoli = await consultarTigimoli({
            codMoli: codigo ? Number(codigo) : null,
            nomMoli: nombre || null,
            fechaGeneracion: fecha || null,
            pagina: pagina ? Number(pagina) : 1,
            registrosPagina: registrosPagina
                ? Number(registrosPagina)
                : 10
        });

        return res.status(200).json({
            success: true,
            totalRegistros: tigimoli.totalRegistros,
            data: tigimoli.datos
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al consultar el historial TIGIMOLI.'
        );
    }
}

/**
 * Consulta el detalle de TIGIMOLI.
 */
export async function consultarDetalle(req, res) {

    try {

        const {
            codigo,
            fecha
        } = req.query;

        const detalle = await consultarDetalleTigimoli({
            codMoli: Number(codigo),
            fechaGeneracion: fecha
        });

        return res.status(200).json({
            success: true,
            data: detalle
        });

    } catch (error) {

        return handleError(
            error,
            res,
            'Error al consultar el detalle TIGIMOLI.'
        );

    }
}


export async function crear(req, res) {
    try {
        await insertarTigimoli(req.body);

        return res.status(201).json({
            success: true,
            message: 'Registro TIGIMOLI creado correctamente.'
        });

    } catch (error) {
        return handleError(
            error,
            res,
            'Error al crear el registro TIGIMOLI.'
        );
    }
}