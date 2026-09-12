import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initDatabase, closeDatabase } from './config/database.js';
import tallasRoutes from './routes/tallas.routes.js';
import rendtallasRoutes from './routes/rendtallas.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


// Middlewares
app.use(cors());
app.use(express.json());


// Ruta de prueba
app.get('/health', (req, res) => {

    res.status(200).json({
        success: true,
        message: 'Molinetes Backend funcionando correctamente.'
    });

});


// Rutas
app.use('/api/tallas', tallasRoutes);

app.use('/api/rendtallas', rendtallasRoutes);


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
            console.log('======================================');

        });

    } catch (error) {

        console.error('No fue posible iniciar el servidor.');
        console.error(error);

        process.exit(1);
    }
}


async function shutdown() {

    console.log('Cerrando servidor...');

    await closeDatabase();

    process.exit(0);
}


process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


startServer();