from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

tasks = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.json

    task_name = data['task']
    urgency = int(data['urgency'])
    importance = int(data['importance'])
    opportunity = int(data['opportunity'])

    score = urgency + importance + opportunity

    task = {
        "task": task_name,
        "urgency": urgency,
        "importance": importance,
        "opportunity": opportunity,
        "score": score
    }

    tasks.append(task)

    return jsonify({"message": "Task added successfully!"})

@app.route('/analyze', methods=['GET'])
def analyze():
    sorted_tasks = sorted(tasks, key=lambda x: x['score'], reverse=True)

    recommendation = ""
    if sorted_tasks:
        recommendation = f"Focus on '{sorted_tasks[0]['task']}' first."

    return jsonify({
        "tasks": sorted_tasks,
        "recommendation": recommendation
    })

if __name__ == '__main__':
    app.run(debug=True)