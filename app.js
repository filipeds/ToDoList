class TaskModel {
    constructor() {
        this.tasks = [];
    }

    addTask(taskName, taskDate, taskId = null) {
        if (taskId) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.name = taskName;
                task.date = taskDate || new Date().toLocaleDateString("pt-BR");
            }
        } else {
            const task = {
                id: Date.now(),
                name: taskName,
                date: taskDate || new Date().toLocaleDateString("pt-BR")
            };
            this.tasks.push(task);
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
    }

    getTasks() {
        return this.tasks;
    }
}

class TaskView {
    constructor() {
        this.taskList = document.getElementById('taskList');
        this.taskInput = document.getElementById('taskInput');
        this.dateInput = document.getElementById('dateInput'); 
        this.addTaskButton = document.getElementById('addTaskButton');
    }

    renderTasks(tasks, deleteCallback, editCallback) {
        this.taskList.innerHTML = tasks
            .map(task => `
                <li>
                    ${task.name} <small>${task.date}</small>
                    <button class="delete" data-id="${task.id}">🗑️</button>
                    <button class="edit" data-id="${task.id}">✏️</button>
                </li>
            `)
            .join("");

        this.taskList.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (event) => {
                const taskId = Number(event.target.dataset.id);
                deleteCallback(taskId);
            });
        });

        this.taskList.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', (event) => {
                const taskId = Number(event.target.dataset.id);
                editCallback(taskId);
            });
        });
    }
}

class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.editingTaskId = null;

        this.view.addTaskButton.addEventListener('click', () => this.addOrUpdateTask());
    }

    addOrUpdateTask() {
        const taskName = this.view.taskInput.value.trim();
        const taskDate = this.view.dateInput.value;
        const formattedDate = taskDate ? new Date(taskDate).toLocaleDateString("pt-BR") : null;

        if (taskName) {
            this.model.addTask(taskName, formattedDate, this.editingTaskId);
            this.view.taskInput.value = "";
            this.view.dateInput.value = ""; 
            this.editingTaskId = null; 
            this.view.addTaskButton.textContent = "Adicionar";
            this.updateView();
        } else {
            alert("Por favor, digite uma tarefa.");
        }
    }

    editTask(taskId) {
        const task = this.model.getTasks().find(task => task.id === taskId);
        if (task) {
            this.view.taskInput.value = task.name;
            this.view.dateInput.value = task.date.split('/').reverse().join('-');
            this.editingTaskId = taskId;
            this.view.addTaskButton.textContent = "Atualizar";
        }
    }

    deleteTask(taskId) {
        this.model.deleteTask(taskId);
        this.updateView();
    }

    updateView() {
        this.view.renderTasks(this.model.getTasks(), this.deleteTask.bind(this), this.editTask.bind(this));
    }
}

const app = new TaskController(new TaskModel(), new TaskView());
