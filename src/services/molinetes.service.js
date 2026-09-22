/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_MOLINETE desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';


/*
  Consulta los molinetes utilizando los filtros recibidos.
*/
export async function consultarMolinetes({
    codMolinete = null,
    nomMolinete = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_MOLINETE.consultaMolinete(
                    :cod_molinete,
                    :nom_molinete,
                    :cursor
                );
            END;
            `,
            {
                cod_molinete: codMolinete,
                nom_molinete: nomMolinete,
                cursor: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );

        const resultSet = result.outBinds.cursor;

        const rows = await resultSet.getRows();

        await resultSet.close();

        return rows.map(row => ({
            codigo: row[0],
            nombre: row[1],
            rpm: row[2],
            perimetro: row [3]
        }));

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Registra un nuevo molinete con la información recibida.
*/
export async function insertarMolinete(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MOLINETE.insertarMolinete(
                    :cod_molinete,
                    :nom_molinete,
                    :rpm_molinete,
                    :peri_molinete
                );
            END;
            `,
            {
                cod_molinete: data.codMolinete,
                nom_molinete: data.nomMolinete,
                rpm_molinete: data.rpmMolinete,
                peri_molinete: data.periMolinete
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Actualiza la información del molinete seleccionado.
*/
export async function actualizarMolinete(codMolinete, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MOLINETE.actualizarMolinete(
                    :cod_molinete,
                    :nom_molinete,
                    :rpm_molinete,
                    :peri_molinete
                );
            END;
            `,
            {
                cod_molinete: codMolinete,
                nom_molinete: data.nomMolinete,
                rpm_molinete: data.rpmMolinete,
                peri_molinete: data.periMolinete
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Elimina el molinete correspondiente al código recibido.
*/
export async function eliminarMolinete(codMolinete) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_MOLINETE.eliminarMolinete(:cod_molinete);
            END;
            `,
            {
                cod_molinete: codMolinete
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}