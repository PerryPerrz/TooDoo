const form = document.querySelector('#taskForm'),
    input = document.querySelector('#taskInput'),
    taskList = document.querySelector('.taskList');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = input.value;

    // Check if task is empty
    if (task.trim() === '') {
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
    taskInput.value = task;

    taskInput.setAttribute("readonly", "true");

    // Add task input to task content
    taskContent.appendChild(taskInput);

    // Add task content to task element
    taskElement.appendChild(taskContent);

    // Add task to the task list
    tasks.appendChild(taskElement);

    // Add task to the task list
    taskList.appendChild(tasks);
});