let courses = [
    { id: 1, nombre: 'Introducción al Desarrollo Web', codigo: 'IDW101', creditos: 4 }
];

exports.getAllCourses = (req, res) => {
    let resultado = courses;
    const { nombre } = req.query;
    if (nombre) {
        resultado = courses.filter(c => c.nombre.toLowerCase().includes(nombre.toLowerCase()));
    }
    res.status(200).json({ status: 'success', data: resultado });
};

exports.getCourseById = (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);
    if (!course) {
        return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
    }
    res.status(200).json({ status: 'success', data: course });
};

exports.createCourse = (req, res) => {
    const { nombre, codigo, creditos } = req.body;
    if (!nombre || !codigo || !creditos) {
        return res.status(400).json({ status: 'fail', message: 'Faltan campos obligatorios' });
    }
    const newCourse = { 
        id: courses.length + 1, 
        nombre, 
        codigo, 
        creditos: parseInt(creditos) 
    };
    courses.push(newCourse);
    res.status(201).json({ status: 'success', data: newCourse });
};

exports.updateCourse = (req, res) => {
    const id = parseInt(req.params.id);
    const courseIndex = courses.findIndex(c => c.id === id);
    if (courseIndex === -1) {
        return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
    }
    const { nombre, codigo, creditos } = req.body;
    courses[courseIndex] = {
        id,
        nombre: nombre || courses[courseIndex].nombre,
        codigo: codigo || courses[courseIndex].codigo,
        creditos: creditos ? parseInt(creditos) : courses[courseIndex].creditos
    };
    res.status(200).json({ status: 'success', data: courses[courseIndex] });
};

exports.deleteCourse = (req, res) => {
    const id = parseInt(req.params.id);
    const courseIndex = courses.findIndex(c => c.id === id);
    if (courseIndex === -1) {
        return res.status(404).json({ status: 'fail', message: 'Curso no encontrado' });
    }
    courses.splice(courseIndex, 1);
    res.status(200).json({ status: 'success', message: 'Curso eliminado correctamente' });
};