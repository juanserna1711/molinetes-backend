/*=============================================================================
  Nombre responsabilidad: Acceso Oracle para usuarios

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: No especificada

  Descripcion responsabilidad:
  Ejecuta los procedimientos de PKG_USUARIO desde los controladores del recurso.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import oracledb from 'oracledb';
import { getConnection } from '../config/database.js';


/*
  Consulta los usuarios utilizando los filtros recibidos.
*/
export async function consultarUsuarios({
    codUsuario = null,
    nomUsuario = null,
    estaUsuario = null
} = {}) {

    let connection;
    let result;

    try {
        connection = await getConnection();

        result = await connection.execute(
            `
            BEGIN
                PKG_USUARIO.consultaUsuario(
                    :cod_usuario,
                    :nom_usuario,
                    :esta_usuario,
                    :cursor
                );
            END;
            `,
            {
                cod_usuario: codUsuario,
                nom_usuario: nomUsuario,
                esta_usuario: estaUsuario,
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
            password: row[2],
            estado: row[3]
        }));

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Registra un nuevo usuario con la información recibida.
*/
export async function insertarUsuario(data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.insertarUsuario(
                    :cod_usuario,
                    :nom_usuario,
                    :pass_usuario,
                    :esta_usuario
                );
            END;
            `,
            {
                cod_usuario: data.codUsuario,
                nom_usuario: data.nomUsuario,
                pass_usuario: data.passUsuario,
                esta_usuario: data.estaUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Actualiza la información del usuario seleccionado.
*/
export async function actualizarUsuario(codUsuario, data) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.actualizarUsuario(
                    :cod_usuario,
                    :nom_usuario,
                    :pass_usuario,
                    :esta_usuario
                );
            END;
            `,
            {
                cod_usuario: codUsuario,
                nom_usuario: data.nomUsuario,
                pass_usuario: data.passUsuario,
                esta_usuario: data.estaUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Activa el registro correspondiente al código recibido.
*/
export async function activarUsuario(codUsuario) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.activarUsuario(:cod_usuario);
            END;
            `,
            {
                cod_usuario: codUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


/*
  Desactiva el registro correspondiente al código recibido.
*/
export async function desactivarUsuario(codUsuario) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.desactivarUsuario(:cod_usuario);
            END;
            `,
            {
                cod_usuario: codUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

/*
  Elimina el usuario correspondiente al código recibido.
*/
export async function eliminarUsuario(codUsuario) {

    let connection;

    try {
        connection = await getConnection();

        await connection.execute(
            `
            BEGIN
                PKG_USUARIO.eliminarUsuario(:cod_usuario);
            END;
            `,
            {
                cod_usuario: codUsuario
            }
        );

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}