/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para molinetes

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_MOLINETE desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/


import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';

export async function buscarUsuarioPorNombre(nombreUsuario) {
    let connection;
    let resultSet;

    try {
        connection = await getConnection();

        const result = await connection.execute(
            `
            BEGIN
                PKG_USUARIO.consultaUsuarioLogin(
                    :nom_usuario,
                    :cursor
                );
            END;
            `,
            {
                nom_usuario: nombreUsuario.trim(),
                cursor: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            }
        );

        resultSet = result.outBinds.cursor;

        const row = await resultSet.getRow();

        if (!row) {
            return null;
        }

        return {
            codigo: row[0],
            nombre: row[1],
            password: row[2],
            estado: row[3]
        };

    } finally {
        if (resultSet) {
            await resultSet.close();
        }

        if (connection) {
            await connection.close();
        }
    }
}