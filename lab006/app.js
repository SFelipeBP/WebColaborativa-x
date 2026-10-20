// app.js
const express = require('express');
const courseRoutes = require('./routes/courseRoute');

const app = express();

// 1. Middleware global incorporado: express.json()
app.use(express.json());

// 2. Middleware personalizado de Auditoría (Logger con tiempo de respuesta)
app.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] Método: ${req.method} | URL: ${req.url} | Status: ${res.statusCode} | Tiempo: ${duration}ms`);
    });
    next();
});

// Enrutador principal del recurso cursos
app.use('/api/cursos', courseRoutes);

// 3. Middleware global de Manejo de Errores (HTTP 500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error interno en el servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Cursos ejecutándose en http://localhost:${PORT}`);
});