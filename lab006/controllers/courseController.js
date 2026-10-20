// controllers/courseController.js
const courses = require('../data/coursesData');

// GET /api/cursos (con soporte opcional para query string ?creditos=...)
exports.getAllCourses = (req, res, next) => {
    try {
        let resultado = courses;
        const { creditos } = req.query;
        if (creditos) {
            resultado = courses.filter(c => c.creditos === parseInt(creditos));
        }
        res.status(200).json({ status: 'success', data: resultado });
    } catch (error) { 
        next(error); 
    }
};

// GET /api/cursos/:id
exports.getCourseById = (req, res, next) => {
    try {
        const course = courses.find(c => c.id === parseInt(req.params.id));
        if (!course) {
            return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
        }
        res.status(200).json({ status: 'success', data: course });
    } catch (error) { 
        next(error); 
    }
};

// POST /api/cursos
exports.createCourse = (req, res, next) => {
    try {
        const { nombre, codigo, creditos } = req.body;
        if (!nombre || !codigo || !creditos) {
            return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios' });
        }
        const newCourse = { 
            id: courses.length > 0 ? courses[courses.length - 1].id + 1 : 1, 
            codigo, 
            nombre, 
            creditos: parseInt(creditos) 
        };
        courses.push(newCourse);
        res.status(201).json({ status: 'success', data: newCourse });
    } catch (error) { 
        next(error); 
    }
};

// PUT /api/cursos/:id
exports.updateCourse = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const courseIndex = courses.findIndex(c => c.id === id);
        if (courseIndex === -1) {
            return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
        }
        
        const { nombre, codigo, creditos } = req.body;
        courses[courseIndex] = {
            id,
            codigo: codigo || courses[courseIndex].codigo,
            nombre: nombre || courses[courseIndex].nombre,
            creditos: creditos ? parseInt(creditos) : courses[courseIndex].creditos
        };
        res.status(200).json({ status: 'success', data: courses[courseIndex] });
    } catch (error) { 
        next(error); 
    }
};

// DELETE /api/cursos/:id
exports.deleteCourse = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const courseIndex = courses.findIndex(c => c.id === id);
        if (courseIndex === -1) {
            return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
        }
        
        courses.splice(courseIndex, 1);
        res.status(200).json({ status: 'success', message: 'Curso eliminado correctamente' });
    } catch (error) { 
        next(error); 
    }
};