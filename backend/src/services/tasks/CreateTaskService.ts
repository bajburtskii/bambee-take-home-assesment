import { Request } from 'express';
import TasksRepository from '../../repositories/TasksRepository';
import TaskStatusEnum from '../../enums/TaskStatusEnum';
import TaskType from '../../types/TaskType';

class CreateTaskService {
  constructor(private readonly tasksRepository = new TasksRepository()) {}

  public async handle(req: Request): Promise<TaskType> {
    const { userId: ownerId } = req.user!;
    const { name, description, dueDate, status } = req.body;

    const newTask = {
      name,
      description: description ?? null,
      dueDate: dueDate ?? null,
      status: status ?? TaskStatusEnum.TODO,
      ownerId,
      isDeleted: 0 as const,
    };

    return await this.tasksRepository.createNew(newTask);
  }
}

export default CreateTaskService;
