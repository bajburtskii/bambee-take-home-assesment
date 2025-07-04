import DbException from '../exceptions/DbException';
import { getDb } from '../db';
import { Database } from 'sqlite';
import TaskType from '../types/TaskType';

class TasksRepository {
  get db(): Database {
    return getDb();
  }

  public async getAll(ownerId: TaskType['ownerId']): Promise<TaskType[]> {
    try {
      const tasks: TaskType[] = await this.db.all('SELECT * FROM tasks WHERE ownerId = ? AND isDeleted = 0', ownerId);
      return tasks;
    } catch (e: unknown) {
      throw new DbException(e);
    }
  }

  public async createNew(task: Omit<TaskType, 'id'>): Promise<TaskType> {
    try {
      const { name, description, status, dueDate, ownerId, isDeleted } = task;

      const res = await this.db.run(
        'INSERT INTO tasks (name, description, status, dueDate, ownerId, isDeleted) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, status, dueDate, ownerId, isDeleted],
      );

      return { id: res.lastID!, ...task };
    } catch (e: unknown) {
      throw new DbException(e);
    }
  }

  public async getOneById(id: TaskType['id']): Promise<TaskType | null> {
    try {
      const task = await this.db.get('SELECT * FROM tasks WHERE id = ?', [id]);

      if (!task) {
        return null;
      }

      return task;
    } catch (e: unknown) {
      throw new DbException(e);
    }
  }

  public async update(id: TaskType['id'], partial: Partial<TaskType>): Promise<void> {
    try {
      const { name, description, status, dueDate, isDeleted } = partial;

      const sets = [];
      const values = [];

      if (name !== undefined) {
        sets.push('name = ?');
        values.push(name);
      }

      if (description !== undefined) {
        sets.push('description = ?');
        values.push(description);
      }

      if (status !== undefined) {
        sets.push('status = ?');
        values.push(status);
      }

      if (dueDate !== undefined) {
        sets.push('dueDate = ?');
        values.push(dueDate);
      }

      if (isDeleted !== undefined) {
        sets.push('isDeleted = ?');
        values.push(Boolean(isDeleted));
      }

      await this.db.run(`UPDATE tasks SET ${sets.join(',')} WHERE id = ?`, [...values, id]);
    } catch (e: unknown) {
      throw new DbException(e);
    }
  }
}

export default TasksRepository;
