class TaskModel {
    constructor() {
        this.tasks = [];
    }

    addTask(taskName, taskDate, taskStatus, taskPriority, taskId = null) {
        if (taskId) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.name = taskName;
                task.date = taskDate || new Date().toLocaleDateString("pt-BR");
                task.taskStatus = taskStatus;
                task.taskPriority = taskPriority;
            }
        } else {
            const task = {
                id: Date.now(),
                name: taskName,
                taskStatus: taskStatus,
                taskPriority: taskPriority,
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
        this.taskList = document.getElementById('taskList'); // tbody
        this.taskInput = document.getElementById('taskInput');
        this.dateInput = document.getElementById('dateInput');
        this.statusSelect = document.getElementById('statusSelect');
        this.prioritySelect = document.getElementById('prioritySelect');
        this.addTaskButton = document.getElementById('addTaskButton');
    }

    renderTasks(tasks, deleteCallback, editCallback) {
        this.taskList.innerHTML = tasks
            .map(task => `
                <tr>
                    <td>${task.name}</td>
                    <td>${task.date}</td>
                    <td>${task.taskStatus}</td>
                    <td>${task.taskPriority}</td>
                    <td>
                        <button class="edit" data-id="${task.id}">✏️</button>
                        <button class="delete" data-id="${task.id}">🗑️</button>
                    </td>
                </tr>
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
        this.updateView();
    }

    addOrUpdateTask() {
        const taskName = this.view.taskInput.value.trim();
        const taskDate = this.view.dateInput.value;
        const formattedDate = taskDate ? new Date(taskDate).toLocaleDateString("pt-BR") : null;
        const taskStatus = this.view.statusSelect.value;
        const taskPriority = this.view.prioritySelect.value;

        if (!taskName || !taskStatus || !taskPriority) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        this.model.addTask(taskName, formattedDate, taskStatus, taskPriority, this.editingTaskId);
        this.clearForm();
        this.updateView();
    }

    editTask(taskId) {
        const task = this.model.getTasks().find(task => task.id === taskId);
        if (task) {
            this.view.taskInput.value = task.name;
            this.view.dateInput.value = task.date.split('/').reverse().join('-');
            this.view.statusSelect.value = task.taskStatus;
            this.view.prioritySelect.value = task.taskPriority;
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

    clearForm() {
        this.view.taskInput.value = "";
        this.view.dateInput.value = "";
        this.view.statusSelect.value = "";
        this.view.prioritySelect.value = "";
        this.editingTaskId = null;
        this.view.addTaskButton.textContent = "Adicionar";
    }
}

const app = new TaskController(new TaskModel(), new TaskView());
