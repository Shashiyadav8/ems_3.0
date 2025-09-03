import React, { useEffect, useState } from 'react';
import { authFetch } from './utils/authFetch';
import './TaskSection.css';

const API_BASE = process.env.REACT_APP_API_URL;

const TaskSection = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ project: '', title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddTask = async e => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_BASE}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error('Failed to add task');

      const addedTask = await res.json();
      setTasks([addedTask, ...tasks]);
      setNewTask({ project: '', title: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await authFetch(`${API_BASE}/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');

      const updatedTask = await res.json();
      setTasks(tasks.map(t => (t._id === taskId ? updatedTask : t)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="task-section-container">
      <h2>My Tasks</h2>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Project"
          value={newTask.project}
          onChange={e => setNewTask({ ...newTask, project: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Tasks Table */}
      <div className="responsive-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Task</th>
              <th>Description</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No tasks assigned yet.</td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task._id} className={task.status === 'Completed' ? 'completed-row' : ''}>
                  <td>{task.project}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    {task.status === 'Completed' ? (
                      <span className="text-green-600 font-semibold">Completed</span>
                    ) : (
                      <select
                        value={task.status}
                        onChange={e => handleStatusChange(task._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    )}
                  </td>
                  <td>{task.start_date ? new Date(task.start_date).toLocaleString() : '-'}</td>
                  <td>{task.end_date ? new Date(task.end_date).toLocaleString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskSection;
