/*=============================================================================
  Nombre responsabilidad: Inicializar la API de MOLIPLUS

  Autor: JUAN ANDRES SERNA CASTRO
  Fecha_creacion: 22/Septiembre/2026

  Descripcion responsabilidad:
  Configura Express, carga dotenv y registra los recursos de tallas, rendimientos, usuarios, molinetes y TIGIMOLI.

  Historial_modificaciones:

  Autor:
  Fecha:
  Descripcion:
=============================================================================*/

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initDatabase, closeDatabase } from './config/database.js';
import tallasRoutes from './routes/tallas.routes.js';
import rendtallasRoutes from './routes/rendtallas.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import molinetesRoutes from './routes/molinetes.routes.js'
import tigimoliRoutes from './routes/tigimoli.routes.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


/*
  Middlewares
*/
app.use(cors());
app.use(express.json());


/*
  Ruta de prueba
*/
app.get('/health', (req, res) => {

    res.status(200).json({
        success: true,
        message: 'Molinetes Backend funcionando correctamente.'
    });

});


/*
  Rutas
*/
app.use('/api/tallas', tallasRoutes);

app.use('/api/rendtallas', rendtallasRoutes);

app.use('/api/usuarios', usuariosRoutes);

app.use('/api/molinetes', molinetesRoutes);

app.use('/api/tigimoli', tigimoliRoutes);


/*
  Inicializa la conexión con Oracle y pone en marcha el servidor.
*/
async function startServer() {

    try {

        await initDatabase();

        app.listen(PORT, () => {

            console.log('======================================');
            console.log(' MOLINETES BACKEND');
            console.log('======================================');
            console.log(`Servidor: http://localhost:${PORT}`);
            console.log(`Health:   http://localhost:${PORT}/health`);
            console.log(`Tallas:   http://localhost:${PORT}/api/tallas`);
            console.log(`Rendimiento x Talla: http://localhost:${PORT}/api/rendtallas`);
            console.log(`Usuarios: http://localhost:${PORT}/api/usuarios`);
            console.log(`Molinetes: http://localhost:${PORT}/api/molinetes`);
            console.log(`Tigimoli: http://localhost:${PORT}/api/tigimoli`)
            console.log('======================================');

        });

    } catch (error) {

        console.error('No fue posible iniciar el servidor.');
        console.error(error);

        process.exit(1);
    }
}


/*
  Cierra las conexiones de base de datos y termina el proceso.
*/
async function shutdown() {

    console.log('Cerrando servidor...');

    await closeDatabase();

    process.exit(0);
}


process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


startServer();