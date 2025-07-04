import React, { useEffect, useState } from 'react';
import api from '../api';
import { removeToken } from '../auth';
import { useNavigate } from 'react-router-dom';
import TaskStatusEnum from '../enums/TaskStatusEnum';
import toDatetimeLocal from '../utils/toDatetimeLocal';
import GeneratedTasks from './GeneratedTasks';
import formatDueDate from '../utils/formatDueDate';

interface Task {
  id: number;
  name: string;
  description?: string;
  dueDate?: number;
  status?: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<Partial<Task>>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      navigate('/login');
    }
  };

  const logout = () => {
    removeToken();
    navigate('/login');
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setIsAdding(false);
    setFormState({ ...task });
  };

  const startAdding = () => {
    setIsAdding(true);
    setEditingTaskId(null);
    setFormState({});
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingTaskId(null);
    setFormState({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name === 'dueDate' ? new Date(value).getTime() : value }));
  };

  const cleanPayload = (payload: Partial<Task>) =>
    Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
    );

  const saveTask = async () => {
    try {
      const payload = cleanPayload(formState);
      await api.put(`/tasks/${editingTaskId}`, payload);
      await fetchTasks();
      cancelForm();
    } catch (err) {
      console.error(err);
      alert('Failed to save task');
    }
  };

  const createTask = async () => {
    try {
      const payload = cleanPayload(formState);
      await api.post('/tasks', payload);
      await fetchTasks();
      cancelForm();
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await api.put(`/tasks/${taskId}`, { isDeleted: true });
      await fetchTasks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  const markAsCompleted = async (taskId: number) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: TaskStatusEnum.DONE });
      await fetchTasks();
    } catch (err) {
      console.error('Failed to mark task as completed:', err);
    }
  };

  const renderDueLabel = (timestamp?: number) => {
    if (!timestamp) return null;

    const due = new Date(timestamp);
    const now = new Date();

    const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dueDate < today) {
      return <span style={{ color: '#dc2626', marginLeft: '0.5rem' }}>❗ Overdue</span>;
    } else if (dueDate.getTime() === today.getTime()) {
      return <span style={{ color: '#facc15', marginLeft: '0.5rem' }}>📅 Today</span>;
    } else {
      return <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>⏳ Upcoming</span>;
    }
  };

  return (
    <>
      <div className="wide-container container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <button
          onClick={logout}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Logout
        </button>

        <div style={{ flex: 1 }}>
          <h2>Tasks</h2>

          <button onClick={startAdding} style={{ marginTop: '1rem' }}>
            Add Task
          </button>

          <div style={{ margin: '1rem 0' }}>
            <label htmlFor="statusFilter">Filter by status: </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="todo">{TaskStatusEnum.TODO}</option>
            </select>
          </div>

          <ul>
            {(isAdding || editingTaskId !== null) && (
              <li>
                <input
                  name="name"
                  value={formState.name || ''}
                  onChange={handleChange}
                  placeholder="Name"
                />
                <input
                  name="description"
                  value={formState.description || ''}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <input
                  name="dueDate"
                  type="datetime-local"
                  value={formState.dueDate ? toDatetimeLocal(formState.dueDate) : ''}
                  onChange={handleChange}
                />
                <select name="status" value={formState.status || ''} onChange={handleChange}>
                  <option value="">Select status</option>
                  <option value="todo">{TaskStatusEnum.TODO}</option>
                  <option value="done">{TaskStatusEnum.DONE}</option>
                </select>
                {editingTaskId ? (
                  <button
                    onClick={saveTask}
                    style={{
                      backgroundColor: '#2563eb', // Blue
                      color: 'white',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                    }}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={createTask}
                    style={{
                      backgroundColor: '#16a34a', // Green
                      color: 'white',
                      border: 'none',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '4px',
                    }}
                  >
                    Create
                  </button>
                )}
                <button
                  onClick={cancelForm}
                  style={{
                    backgroundColor: '#9ca3af',
                    color: 'white',
                    marginLeft: '0.5rem',
                    border: 'none',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                  }}
                >
                  Cancel
                </button>
              </li>
            )}

            {tasks
              .filter(task => {
                if (statusFilter === 'all') return true;
                return task.status === statusFilter;
              })
              .map(task =>
                <div key={task.id} className="task-item"> {
                  editingTaskId === task.id ? null : (
                    <li key={task.id}>
                      <h3>
                        {task.name}
                        <span className={`task-status ${task.status === 'done' ? 'status-done' : 'status-todo'}`}>
                          {task.status}
                        </span>
                      </h3>
                      <div>{task.description}</div>
                      <p>
                        Due: {formatDueDate(task.dueDate)} {renderDueLabel(task.dueDate)}
                      </p>

                      <br />
                      {task.status !== 'done' && (
                        <button
                          onClick={() => markAsCompleted(task.id)}
                          className="button-small button-complete"
                        >
                          Mark as Completed
                        </button>
                      )}

                      <button
                        onClick={() => startEditing(task)}
                        className="button-small button-edit"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="button-small button-delete"
                      >
                        Delete
                      </button>
                    </li>
                  )
                }
                </div>
              )}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h2>AI suggestions</h2>

          <GeneratedTasks onTaskAdded={fetchTasks} />
        </div>
      </div>
    </>

  );
};

export default TasksPage;
