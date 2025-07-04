import TaskNotFoundException from '../../exceptions/TaskNotFoundException';
import { Request } from 'express';
import TasksRepository from '../../repositories/TasksRepository';
import CheckIfTaskCanBeAccessedService from './CheckIfTaskCanBeAccessedService';
import AccessForbiddenException from '../../exceptions/AccessForbiddenException';

class UpdateTaskService {
  constructor(
    private readonly tasksRepository = new TasksRepository(),
    private readonly checkIfTaskCanBeAccessedService = new CheckIfTaskCanBeAccessedService(),
  ) {}

  public async handle(req: Request): Promise<void> {
    const {
      params: { id },
      body: { name, description, dueDate, status, isDeleted },
      user,
    } = req;

    const taskId = Number(id);

    const task = await this.tasksRepository.getOneById(taskId);
    if (task === null) {
      throw new TaskNotFoundException();
    }

    if (!this.checkIfTaskCanBeAccessedService.handle(task, user!)) {
      throw new AccessForbiddenException();
    }

    await this.tasksRepository.update(taskId, { name, description, dueDate, status, isDeleted });
  }
}

export default UpdateTaskService;
