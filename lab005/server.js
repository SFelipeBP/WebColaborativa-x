const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Función auxiliar para inferir el Content-Type de los archivos estáticos
function getContentType(ext) {
    switch (ext) {
        case '.html': return 'text/html; charset=utf-8';
        case '.css': return 'text/css; charset=utf-8';
        case '.js': return 'application/javascript; charset=utf-8';
        case '.json': return 'application/json; charset=utf-8';
        case '.png': return 'image/png';
        case '.jpg': return 'image/jpeg';
        default: return 'text/plain; charset=utf-8';
    }
}

const server = http.createServer((req, res) => {
    console.log(`Petición recibida: ${req.method} ${req.url}`);

    // 1. Ruta GET /api/estudiantes: Retornar lista en formato JSON
    if (req.url === '/api/estudiantes' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'data', 'estudiantes.json');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify([]));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(data);
            }
        });
    } 
    // 2. Ruta POST /api/estudiantes: Capturar chunks, parsear y guardar en persistencia local
    else if (req.url === '/api/estudiantes' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const nuevoEstudiante = JSON.parse(body);
                const filePath = path.join(__dirname, 'data', 'estudiantes.json');

                fs.readFile(filePath, 'utf8', (err, data) => {
                    let estudiantes = [];
                    if (!err && data) {
                        try { estudiantes = JSON.parse(data); } catch (e) { estudiantes = []; }
                    }

                    // Generar ID autoincremental
                    const nuevoId = estudiantes.length > 0 ? estudiantes[estudiantes.length - 1].id + 1 : 1;
                    const estudianteConId = { id: nuevoId, ...nuevoEstudiante };
                    estudiantes.push(estudianteConId);

                    // Guardar en el archivo JSON
                    fs.writeFile(filePath, JSON.stringify(estudiantes, null, 2), (writeErr) => {
                        if (writeErr) {
                            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify({ message: 'Error interno al guardar' }));
                            return;
                        }

                        // Retornar código 201 Created con el registro guardado
                        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify({
                            message: 'Estudiante registrado con éxito',
                            estudiante: estudianteConId
                        }));
                    });
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'Formato JSON inválido' }));
            }
        });
    } 
    // 3. Servir contenido estático desde la carpeta /public asíncronamente
    else if (req.method === 'GET') {
        let filePath = req.url === '/'
            ? path.join(__dirname, 'public', 'index.html')
            : path.join(__dirname, 'public', req.url);

        const extname = path.extname(filePath);
        const contentType = getContentType(extname);

        fs.readFile(filePath, (err, content) => {
            if (err) {
                // 4. Manejo de rutas no existentes retornando un JSON con código 404 Not Found
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    } 
    // Manejo general por defecto para otros métodos no encontrados (404)
    else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ message: 'Recurso no encontrado' }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});