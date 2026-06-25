let taskArray = [];

async function addTask() {
    const task = document.getElementById("task").value;
    const urgency = document.getElementById("urgency").value;
    const importance = document.getElementById("importance").value;
    const opportunity = document.getElementById("opportunity").value;

    if (!task || !urgency || !importance || !opportunity) {
        alert("Please fill all fields");
        return;
    }

    await fetch('/add_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            task,
            urgency,
            importance,
            opportunity
        })
    });

    taskArray.push(task);
    updateTaskList();

    document.getElementById("task").value = "";
    document.getElementById("urgency").value = "";
    document.getElementById("importance").value = "";
    document.getElementById("opportunity").value = "";

    document.getElementById("task").focus();
}

function updateTaskList() {
    let html = "";

    taskArray.forEach(task => {
        html += `<div class="task-item">${task}</div>`;
    });

    document.getElementById("taskList").innerHTML = html;
    document.getElementById("totalTasks").innerText = taskArray.length;
}

async function analyzeTasks() {
    const response = await fetch('/analyze');
    const data = await response.json();

    let output = "";

    let highPriority = 0;

    data.tasks.forEach(task => {
        if (task.score >= 25) highPriority++;

        output += `
            <div class="task-item">
                <strong>${task.task}</strong><br>
                Priority Score: ${task.score}
            </div>
        `;
    });

    document.getElementById("highPriority").innerText = highPriority;

    let efficiency = data.tasks.length
        ? Math.floor((highPriority / data.tasks.length) * 100)
        : 0;

    document.getElementById("efficiency").innerText = efficiency + "%";

    output += `<br><h3>Recommendation</h3><br><p>${data.recommendation}</p>`;

    document.getElementById("results").innerHTML = output;
}

