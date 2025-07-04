import UserType from '../../types/UserType';
import TasksRepository from '../../repositories/TasksRepository';
import TaskType from '../../types/TaskType';

class GetUserTasksService {
  constructor(private readonly tasksRepository = new TasksRepository()) {}

  public async handle(userId: UserType['id']): Promise<TaskType[]> {
    return await this.tasksRepository.getAll(userId);
  }
}

export default GetUserTasksService;
