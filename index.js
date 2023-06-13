import { Task } from './task.js';

const form = document.querySelector('#taskForm'),
    input = document.querySelector('#taskInput'),
    taskList = document.querySelector('.taskList');

// Add listener to edit and delete buttons
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('editBtn')) {
        editTask(e.target);
    } else if (e.target.classList.contains('deleteBtn')) {
        deleteTask(e.target);
    }
});

// Store task in local storage
const storeTaskInLocalStorage = (task) => {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    tasks.push(task.index + ";" + task.name);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete task from local storage
const deleteTaskFromLocalStorage = (taskIndex) => {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    tasks.forEach((taskContent, localStorageIndex) => {
        const [index, name] = taskContent.split(";");
        if (index == taskIndex) {
            tasks.splice(localStorageIndex, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get tasks from local storage
const getTasks = () => {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    // Travel the index of all tasks and put the higher index in the index counter
    tasks.forEach(task => {
        const [index, name] = task.split(";");
        Task.indexCounter = index > Task.indexCounter ? index : Task.indexCounter;
    });

    // Create tasks element
    tasks.forEach(task => {
        const [index, name] = task.split(";");
        taskList.innerHTML += `
        <div class="tasks">
            <div class="task">
                <div class="content">
                    <input type="text" class="text" value="${name}" readonly>
                </div>
                <div class="actions">
                    <button class="editBtn" data='{ "index": ${index}}'>Edit</button>
                    <button class="deleteBtn" data='{ "index": ${index}}'>Delete</button>
                </div>
            </div>
        </div>
        `;
    });

    // If there are tasks, display the clear button text
    if (taskList.querySelectorAll('.task').length > 0) {
        document.querySelector('#clearBtn').innerHTML = 'Clear all';
    }
}

// Get tasks from local storage
document.addEventListener('DOMContentLoaded', getTasks);

// Form submit event
form.addEventListener('submit', (e) => {
    e.preventDefault();

    var task = new Task(true, input.value);

    // Check if task is empty
    if (task.name.trim() === '') {
        alert('Please enter a task');
        return;
    }

    // Create tasks element
    const tasks = document.createElement('div');
    tasks.classList.add('tasks');

    // Create task element
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    // Create task text
    const taskContent = document.createElement('div');
    taskContent.classList.add('content');

    // Create task input
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.classList.add('text');
    taskInput.value = task.name;

    taskInput.setAttribute("readonly", "true");

    // Add task input to task content
    taskContent.appendChild(taskInput);

    // Add task content to task element
    taskElement.appendChild(taskContent);

    // Create task actions
    const taskActions = document.createElement('div');
    taskActions.classList.add('actions');

    // Create task edit button
    const taskEdit = document.createElement('button');
    taskEdit.id = 'editButton';
    taskEdit.classList.add('editBtn');
    taskEdit.setAttribute('data', '{ "index": ' + task.index + '}');
    taskEdit.innerHTML = 'Edit';

    // Create task delete button
    const taskDelete = document.createElement('button');
    taskDelete.classList.add('deleteBtn');
    taskDelete.setAttribute('data', '{ "index": ' + task.index + '}');
    taskDelete.innerHTML = 'Delete';

    // Add task edit button to task actions
    taskActions.appendChild(taskEdit);

    // Add task delete button to task actions
    taskActions.appendChild(taskDelete);

    // Add task actions to task element
    taskElement.appendChild(taskActions);

    // Add task to the task list
    tasks.appendChild(taskElement);

    // Add task to the task list
    taskList.appendChild(tasks);

    // Add task to local storage
    storeTaskInLocalStorage(task);

    // Clear input
    input.value = '';

    // If there are tasks, display the clear button text
    if (taskList.querySelectorAll('.task').length > 0) {
        document.querySelector('#clearBtn').innerHTML = 'Clear all';
    }
});

// Edit task
const editTask = (editBtn) => {
    const taskInput = editBtn.parentElement.parentElement.querySelector('.content .text');
    if (editBtn.innerHTML === 'Edit') {
        // If there is a task being edited and the user clicks on another edit button, save the task being edited
        const editBtns = document.querySelectorAll('.editBtn');
        editBtns.forEach(editBtn => {
            if (editBtn.innerHTML === 'Save') {
                editBtn.innerHTML = 'Edit';
                editBtn.parentElement.parentElement.querySelector('.content .text').setAttribute("readonly", "true");
            }
        });

        // Get the index of the task being edited
        var taskIndex = JSON.parse(editBtn.getAttribute('data')).index;

        taskInput.removeAttribute("readonly");
        taskInput.focus();
        editBtn.innerHTML = 'Save';

        // After editing the task, store it in local storage
        taskInput.addEventListener('blur', () => {
            // Delete the old task from local storage
            deleteTaskFromLocalStorage(taskIndex);

            // If the task is already in local storage, don't add it again
            if (localStorage.getItem('tasks').includes(taskIndex + ";" + taskInput.value)) {
                return;
            }
            storeTaskInLocalStorage(new Task(false, taskInput.value, taskIndex));
        });
    } else {
        taskInput.setAttribute("readonly", "true");
        editBtn.innerHTML = 'Edit';
    }
}

// Delete task
const deleteTask = (deleteBtn) => {
    // If there is a task being edited and the user clicks on another delete button, save the task being edited
    const editBtns = document.querySelectorAll('.editBtn');
    editBtns.forEach(editBtn => {
        if (editBtn.innerHTML === 'Save') {
            editBtn.innerHTML = 'Edit';
            editBtn.parentElement.parentElement.querySelector('.content .text').setAttribute("readonly", "true");
        }
    });

    var deleteBtnData = JSON.parse(deleteBtn.getAttribute('data'));

    var taskIndex = deleteBtnData.index;

    // Delete task from local storage with the index
    deleteTaskFromLocalStorage(taskIndex);

    // Delete task from the DOM
    deleteBtn.parentElement.parentElement.parentElement.remove();

    // If there are no more tasks, reset the index counter
    let tasks = document.querySelectorAll('.task');
    if (tasks.length === 0) {
        Task.indexCounter = 0;
        // If there are no more tasks, hide the clear button text
        document.querySelector('#clearBtn').innerHTML = '';
    }
}

// Clear all tasks
const clearTasks = () => {
    // If there is a task being edited and the user clicks on the clear button, save the task being edited
    const editBtns = document.querySelectorAll('.editBtn');
    editBtns.forEach(editBtn => {
        if (editBtn.innerHTML === 'Save') {
            editBtn.innerHTML = 'Edit';
            editBtn.parentElement.parentElement.querySelector('.content .text').setAttribute("readonly", "true");
        }
    });

    // Delete all tasks from local storage
    localStorage.clear();

    // Delete all tasks from the DOM
    taskList.innerHTML = '';

    // Reset the index counter
    Task.indexCounter = 0;

    // Hide the clear button text
    document.querySelector('#clearBtn').innerHTML = '';
}

// Clear all tasks event
document.querySelector('#clearBtn').addEventListener('click', clearTasks);

// Export tasks to JSON
const exportTasks = () => {
    // If there is a task being edited and the user clicks on the export button, save the task being edited
    const editBtns = document.querySelectorAll('.editBtn');
    editBtns.forEach(editBtn => {
        if (editBtn.innerHTML === 'Save') {
            editBtn.innerHTML = 'Edit';
            editBtn.parentElement.parentElement.querySelector('.content .text').setAttribute("readonly", "true");
        }
    });

    // Get all tasks from local storage
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'))
    }

    // Create a JSON file
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));

    // Create a link to download the JSON file
    let dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "tasks.json");
    dlAnchorElem.click();
}

// Import tasks from JSON
const importTasks = () => {
    // If there is a task being edited and the user clicks on the import button, save the task being edited
    const editBtns = document.querySelectorAll('.editBtn');
    editBtns.forEach(editBtn => {
        if (editBtn.innerHTML === 'Save') {
            editBtn.innerHTML = 'Edit';
            editBtn.parentElement.parentElement.querySelector('.content .text').setAttribute("readonly", "true");
        }
    });

    // Create an input to upload the JSON file
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.click();

    // When the user selects a file, read it
    input.addEventListener('change', (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file);

        // When the file is read, add the tasks to local storage
        reader.onload = () => {
            let tasks = JSON.parse(reader.result);
            tasks.forEach(task => {
                const [index, name] = task.split(";");
                taskList.innerHTML += `
                <div class="tasks">
                    <div class="task">
                        <div class="content">
                            <input type="text" class="text" value="${name}" readonly>
                        </div>
                        <div class="actions">
                            <button class="editBtn" data='{ "index": ${index}}'>Edit</button>
                            <button class="deleteBtn" data='{ "index": ${index}}'>Delete</button>
                        </div>
                    </div>
                </div>
                `;
            });

            // If there are tasks, display the clear button text
            if (taskList.querySelectorAll('.task').length > 0) {
                document.querySelector('#clearBtn').innerHTML = 'Clear all';
            }

            // Add tasks to local storage
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });
}

// Export tasks event
document.querySelector('#exportBtn').addEventListener('click', exportTasks);

// Import tasks event
document.querySelector('#importBtn').addEventListener('click', importTasks);