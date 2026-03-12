const missionNameInput = document.querySelector('.field-mission-name .field-input');
const targetDateInput = document.querySelector('.field-target-date .field-input-date');
const prioritySelect = document.querySelector('.field-priority .field-select');
const deployBtn = document.querySelector('.btn-deploy');
const taskList = document.querySelector('.task-list');
const headerStatusValue = document.querySelector('.header-status-value');
const tabs = document.querySelectorAll('.tab');
const clearCompletedBtn = document.querySelector('.btn-clear');
const emptyStateCard = document.querySelector('.empty-state-card');
const initializeBtn = document.querySelector('.btn-initialize');

let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    if (!dateString) return 'No Date Set';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

function getPriorityClass(priority) {
    if (priority === 'High') return 'badge-urgent';
    if (priority === 'Medium') return 'badge-medium';
    return 'badge-low';
}

function getPriorityLabel(priority) {
    if (priority === 'High') return 'Urgent';
    return priority;
}

function updateTaskCount() {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    const taskWord = remainingTasks === 1 ? 'Task' : 'Tasks';
    headerStatusValue.textContent = `${remainingTasks} ${taskWord} Remaining`;
}

function checkEmptyState() {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        taskList.style.display = 'none';
        emptyStateCard.style.display = 'flex';
    } else {
        taskList.style.display = 'flex';
        emptyStateCard.style.display = 'none';
    }
}

function getFilteredTasks() {
    if (currentFilter === 'active') {
        return tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed);
    }
    return tasks;
}

function createTaskElement(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card${task.completed ? ' task-completed' : ''}`;
    taskCard.dataset.id = task.id;
    
    const dateLabel = task.completed ? `Completed ${formatDate(task.completedDate)}` : `Target Date: ${formatDate(task.targetDate)}`;
    
    taskCard.innerHTML = `
        <div class="task-content">
            <input class="task-checkbox" type="checkbox" ${task.completed ? 'checked' : ''} />
            <div class="task-info">
                <div class="task-meta">
                    <span class="badge ${getPriorityClass(task.priority)}">${getPriorityLabel(task.priority)}</span>
                    <span class="task-date">${dateLabel}</span>
                </div>
                <h3 class="task-title${task.completed ? ' task-title-done' : ''}">${task.name}</h3>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-icon btn-edit"><span class="material-symbols-outlined">edit</span></button>
            <button class="btn-icon btn-delete"><span class="material-symbols-outlined">delete</span></button>
        </div>
    `;
    
    return taskCard;
}

function renderTasks() {
    taskList.innerHTML = '';
    
    const filteredTasks = getFilteredTasks();
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
    
    updateTaskCount();
    checkEmptyState();
    saveTasks();
}

function addTask(name, targetDate, priority) {
    if (!name.trim()) {
        shakeElement(missionNameInput);
        return;
    }
    
    const newTask = {
        id: generateId(),
        name: name.trim(),
        targetDate: targetDate,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    renderTasks();
    clearInputs();
    
    const newTaskElement = taskList.querySelector(`[data-id="${newTask.id}"]`);
    if (newTaskElement) {
        newTaskElement.style.opacity = '0';
        newTaskElement.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            newTaskElement.style.transition = 'opacity 0.3s, transform 0.3s';
            newTaskElement.style.opacity = '1';
            newTaskElement.style.transform = 'translateY(0)';
        }, 10);
    }
}

function updateTask(id, name, targetDate, priority) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].name = name.trim();
        tasks[taskIndex].targetDate = targetDate;
        tasks[taskIndex].priority = priority;
        renderTasks();
    }
    
    editingTaskId = null;
    deployBtn.textContent = 'Deploy Task';
}

function deleteTask(id) {
    const taskElement = taskList.querySelector(`[data-id="${id}"]`);
    
    if (taskElement) {
        taskElement.style.transition = 'opacity 0.3s, transform 0.3s';
        taskElement.style.opacity = '0';
        taskElement.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            renderTasks();
        }, 300);
    }
}

function toggleTaskComplete(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        
        if (tasks[taskIndex].completed) {
            tasks[taskIndex].completedDate = new Date().toISOString();
        } else {
            delete tasks[taskIndex].completedDate;
        }
        
        renderTasks();
    }
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    
    if (task) {
        missionNameInput.value = task.name;
        targetDateInput.value = task.targetDate || '';
        prioritySelect.value = task.priority;
        
        editingTaskId = id;
        deployBtn.textContent = 'Update Mission';
        
        missionNameInput.focus();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

function clearInputs() {
    missionNameInput.value = '';
    targetDateInput.value = '';
    prioritySelect.value = 'High';
}

function clearCompletedTasks() {
    const completedTasks = taskList.querySelectorAll('.task-completed');
    
    completedTasks.forEach((taskElement, index) => {
        setTimeout(() => {
            taskElement.style.transition = 'opacity 0.3s, transform 0.3s';
            taskElement.style.opacity = '0';
            taskElement.style.transform = 'scale(0.8)';
        }, index * 100);
    });
    
    setTimeout(() => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    }, completedTasks.length * 100 + 300);
}

function setActiveTab(clickedTab) {
    tabs.forEach(tab => tab.classList.remove('active-tab'));
    clickedTab.classList.add('active-tab');
    
    const tabText = clickedTab.textContent.toLowerCase();
    currentFilter = tabText;
    
    renderTasks();
}

function shakeElement(element) {
    element.style.transition = 'transform 0.1s';
    element.style.transform = 'translateX(-5px)';
    
    setTimeout(() => {
        element.style.transform = 'translateX(5px)';
    }, 100);
    
    setTimeout(() => {
        element.style.transform = 'translateX(-5px)';
    }, 200);
    
    setTimeout(() => {
        element.style.transform = 'translateX(0)';
    }, 300);
    
    element.style.borderColor = '#B31B1B';
    
    setTimeout(() => {
        element.style.borderColor = '#000';
    }, 1000);
}

function saveTasks() {
    localStorage.setItem('kyivTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('kyivTasks');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [];
    }
    
    renderTasks();
}

deployBtn.addEventListener('click', function() {
    const name = missionNameInput.value;
    const targetDate = targetDateInput.value;
    const priority = prioritySelect.value;
    
    if (editingTaskId) {
        updateTask(editingTaskId, name, targetDate, priority);
    } else {
        addTask(name, targetDate, priority);
    }
});

missionNameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        deployBtn.click();
    }
});

taskList.addEventListener('click', function(e) {
    const taskCard = e.target.closest('.task-card');
    if (!taskCard) return;
    
    const taskId = taskCard.dataset.id;
    
    if (e.target.classList.contains('task-checkbox')) {
        toggleTaskComplete(taskId);
    }
    
    if (e.target.closest('.btn-delete')) {
        deleteTask(taskId);
    }
    
    if (e.target.closest('.btn-edit')) {
        editTask(taskId);
    }
});

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        setActiveTab(this);
    });
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

if (initializeBtn) {
    initializeBtn.addEventListener('click', function() {
        missionNameInput.focus();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && editingTaskId) {
        editingTaskId = null;
        deployBtn.textContent = 'Deploy Task';
        clearInputs();
    }
});

deployBtn.addEventListener('mousedown', function() {
    this.style.transform = 'translate(4px, 4px)';
    this.style.boxShadow = 'none';
});

deployBtn.addEventListener('mouseup', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
});

deployBtn.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
});

loadTasks();