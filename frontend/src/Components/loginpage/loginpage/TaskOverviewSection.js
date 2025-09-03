import React, { useEffect, useState, useCallback } from 'react';
import { authFetch } from './utils/authFetch';
import './TaskOverviewSection.css';

const API_BASE = process.env.REACT_APP_API_URL;

const AdminTaskOverview = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/tasks/all`);
      const data = await res.json();

      const formattedData = data.map(task => ({
        ...task,
        employee_name: task.employee_ref?.name || 'Unknown',
        employee_id: task.employee_ref?.employee_id || task.employee_id
      }));

      setTasks(formattedData);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter(task =>
    (task.employee_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (task.employee_id || '').toLowerCase().includes(search.toLowerCase()) ||
    (task.project || '').toLowerCase().includes(search.toLowerCase()) ||
    (task.status || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-task-overview">
      <h3>📝 All Employee Tasks</h3>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by employee, project, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="responsive-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Project</th>
              <th>Task</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No tasks found.</td>
              </tr>
            ) : (
              filteredTasks.map(task => (
                <tr key={task._id}>
                  <td>{task.employee_name}</td>
                  <td>{task.employee_id}</td>
                  <td>{task.project}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.start_date ? new Date(task.start_date).toLocaleString() : '-'}</td>
                  <td>{task.end_date ? new Date(task.end_date).toLocaleString() : '-'}</td>
                  <td>{task.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTaskOverview;
