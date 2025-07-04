import React, { useState } from 'react';
import api from '../api';
import TaskType from '../types/TaskType';

interface Props {
  onTaskAdded: () => void;
}

const GeneratedTasks = ({ onTaskAdded }: Props) => {
  const [generatedTasks, setGeneratedTasks] = useState<TaskType[]>([]);
  const [showGenerated, setShowGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingTaskId, setAddingTaskId] = useState<number | string | null>(null);

  const fetchGeneratedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/tasks/generated');
      setGeneratedTasks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch generated tasks');
    } finally {
      setLoading(false);
    }
  };

  const toggleGeneratedTasks = () => {
    if (!showGenerated) {
      fetchGeneratedTasks();
    }
    setShowGenerated(!showGenerated);
  };

  const handleAddTask = async (task: TaskType) => {
    const taskKey = task.name;
    setAddingTaskId(taskKey);
    try {
      const payload = {
        name: task.name,
        description: task.description,
      };

      await api.post('/tasks', payload);
      onTaskAdded();

      setGeneratedTasks(prev =>
        prev.filter(t => (t.id ?? t.name) !== taskKey)
      );
    } catch (err) {
      console.error(err);
      alert('Failed to add task');
    } finally {
      setAddingTaskId(null);
    }
  };


  return (
    <div style={{ marginTop: '2rem' }}>
      <button onClick={toggleGeneratedTasks}>
        {showGenerated ? 'Hide Generated Tasks' : 'Show Generated Tasks'}
      </button>

      {showGenerated && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Generated Tasks</h3>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && (
            <ul>
              {generatedTasks.length === 0 && <li>No generated tasks found</li>}
              {generatedTasks.map(task => (
                <li key={task.id ?? task.name}>
                  <strong>{task.name}</strong> — {task.description ?? ''}
                  <button
                    onClick={() => handleAddTask(task)}
                    className="button-add-icon"
                    disabled={addingTaskId === (task.id ?? task.name)}
                    title="Add this task"
                  >
                    ➕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GeneratedTasks;
