import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,

    poolMin: 1,
    poolMax: 5,
    poolIncrement: 1
};

let pool;

export async function initDatabase() {
    try {
        pool = await oracledb.createPool(poolConfig);

        console.log('Pool de conexiones Oracle creado correctamente.');
    } catch (error) {
        console.error('Error al crear el pool de conexiones Oracle:');
        throw error;
    }
}

export async function getConnection() {
    if (!pool) {
        throw new Error('El pool de conexiones Oracle no ha sido inicializado.');
    }

    return await pool.getConnection();
}

export async function closeDatabase() {
    if (pool) {
        await pool.close(10);
        pool = null;

        console.log('Pool de conexiones Oracle cerrado.');
    }
}