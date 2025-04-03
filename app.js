class TaskModel {
    constructor() {
        this.tasks = [];
    }

    addTask(taskName, taskDate) {
        const task = {
            id: Date.now(),
            name: taskName,
            date: taskDate || new Date().toLocaleDateString("pt-BR")
        };
        this.tasks.push(task);
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

    renderTasks(tasks, deleteCallback) {
        this.taskList.innerHTML = tasks
            .map(task => `
                <li>
                    ${task.name} <small>${task.date}</small>
                    <button class="delete" data-id="${task.id}">🗑</button>
                </li>
            `)
            .join("");

        this.taskList.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', (event) => {
                const taskId = Number(event.target.dataset.id);
                deleteCallback(taskId);
            });
        });
    }
}

class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.addTaskButton.addEventListener('click', () => this.addTask());
    }

    addTask() {
        const taskName = this.view.taskInput.value.trim();
        const taskDate = this.view.dateInput.value;

        if (taskName) {
            const formattedDate = taskDate ? new Date(taskDate).toLocaleDateString("pt-BR") : null;
            this.model.addTask(taskName, formattedDate);
            this.view.taskInput.value = "";
            this.view.dateInput.value = ""; 
            this.updateView();
        } else {
            alert("Por favor, digite uma tarefa.");
        }
    }

    deleteTask(taskId) {
        this.model.deleteTask(taskId);
        this.updateView();
    }

    updateView() {
        this.view.renderTasks(this.model.getTasks(), this.deleteTask.bind(this));
    }
}

const app = new TaskController(new TaskModel(), new TaskView());
