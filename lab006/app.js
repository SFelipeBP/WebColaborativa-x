const express = require('express');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} en ${req.url}`);
    next();
});

app.use('/api/v1/cursos', courseRoutes);

app.listen(3000, () => {
    console.log('API Express en puerto 3000');
});



