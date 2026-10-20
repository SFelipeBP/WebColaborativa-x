// app.js - Módulo de Gestión de Tareas Académicas
const form = document.querySelector('#todo-form');
const inputTitle = document.querySelector('#todo-title');
const inputCourse = document.querySelector('#todo-course');
const inputDate = document.querySelector('#todo-date');
const list = document.querySelector('#todo-list');
const alertBox = document.querySelector('#alert-box');
const filterButtons = document.querySelectorAll('#filter-buttons button');

// 1. Gestión del Estado y Estructuras de Datos
let tasks = JSON.parse(localStorage.getItem('academic_tasks')) || [];
let currentFilter = 'todas';

// Función para mostrar alertas dinámicas
function showAlert(message, type = 'danger') {
    alertBox.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show py-2" role="alert">
            ${message}
            <button type="button" class="btn-close py-2" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    setTimeout(() => { alertBox.innerHTML = ''; }, 4000);
}

// 4. Persistencia de Datos
function saveAndRender() {
    localStorage.setItem('academic_tasks', JSON.stringify(tasks));
    renderTasks();
}

// 3. Manipulación Dinámica del DOM y Métodos Iterativos ES6+
function renderTasks() {
    list.innerHTML = '';

    // Filtrado usando filter()
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pendientes') return !task.completada;
        if (currentFilter === 'completadas') return task.completada;
        return true;
    });

    if (filteredTasks.length === 0) {
        list.innerHTML = `<li class="list-group-item text-center text-muted">No hay tareas para mostrar en este filtro.</li>`;
        return;
    }

    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completada ? 'list-group-item-secondary' : ''}`;
        
        const titleStyle = task.completada ? 'text-decoration-line-through text-muted' : 'fw-bold';

        li.innerHTML = `
            <div>
                <span class="${titleStyle}">${task.titulo}</span>
                <span class="badge bg-primary ms-2">${task.curso}</span>
                <br>
                <small class="text-muted">Fecha de entrega: ${task.fechaEntrega}</small>
            </div>
            <div>
                <button class="btn ${task.completada ? 'btn-warning' : 'btn-success'} btn-sm me-2" onclick="toggleTask(${task.id})">
                    ${task.completada ? 'Desmarcar' : 'Completar'}
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// 2. Captura y Validación con JavaScript
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = inputTitle.value.trim();
    const curso = inputCourse.value.trim();
    const fechaEntrega = inputDate.value;

    // Validación: Campos no vacíos
    if (!titulo || !curso || !fechaEntrega) {
        showAlert('Por favor complete todos los campos requeridos.', 'danger');
        return;
    }

    // Validación: Fecha posterior a la fecha actual
    const today = new Date().toISOString().split('T')[0];
    if (fechaEntrega <= today) {
        showAlert('La fecha de entrega debe ser estrictamente posterior a la fecha actual.', 'warning');
        return;
    }

    const newTask = {
        id: Date.now(),
        titulo,
        curso,
        fechaEntrega,
        completada: false
    };

    tasks.push(newTask);
    saveAndRender();

    inputTitle.value = '';
    inputCourse.value = '';
    inputDate.value = '';
    
    showAlert('¡Tarea académica registrada con éxito!', 'success');
});

// Cambiar estado usando map()
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completada: !task.completada } : task
    );
    saveAndRender();
}

// Eliminar tarea usando filter()
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

// Configuración de los filtros visuales
filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderTasks();
    });
});

// Carga inicial al dispararse DOMContentLoaded
document.addEventListener('DOMContentLoaded', renderTasks);